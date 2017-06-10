import { h, Component } from 'preact';
import Clipboard from 'clipboard';
import nicetime from 'nicetime';
import formatSize from 'formatsize';
import * as CpVault from 'cpvault';
import Store from 'store';

export default class Paste extends Component {
  getKey() {
    return this.props.matches.key || this.props.key;
  }

  componentDidMount() {
    this.setState({ loading: true });

    const key = this.getKey();

    Promise.all([
      CpVault.getPaste(key),
      CpVault.getPasteHtmlContent(key),
      Store.getThemeCss()
    ]).then((res) => {
      const [data, html ,css] = [res[0].data, res[1], res[2]];

      this.setState({ data, content: html, themeCss: css, loading: false });

			// Setup appbar
      Store.appBar.rightMenuIcons = [
        {
          id: 'copy',
          tooltip: 'Copy',
          icon: 'content_copy',
          onClick: this.copyPaste
        },
        {
          id: 'download',
          tooltip: 'Download',
          icon: 'file_download',
          onClick: this.downloadPaste
        }
      ];

			// Setup sidebar
      Store.sideBars.right.title = data.title;
      Store.sideBars.right.children = [
        <div class="info-row"><span>Language:</span><span>{data.syntax.name}</span></div>,
        <div class="info-row"><span>Size:</span><span>{formatSize(data.size)}</span></div>,
        <div class="info-row"><span>Published:</span><span>{nicetime(data.createdAt * 1000)}</span></div>,
        <div class="info-row"><span>Lines</span><span>{data.lines}</span></div>
      ];

      Store.update();

      this.afterPasteInitialized();
    });

    Store.listen('theme', () => {
      Store.getThemeCss().then(css => this.setState({ themeCss: css }));
    });
  }

  afterPasteInitialized() {
    function copyScroll(from, to) {
      from.addEventListener('scroll', () => {
        to.style.transform = 'translateY(' + -from.scrollTop + 'px)';
      });
    }

    copyScroll(document.querySelector('.code'), document.querySelector('.line-numbers-rows'));
  }

  getRawContent() {
    return document.querySelector('.code').textContent;
  }

  downloadPaste = () => {
    let raw = this.getRawContent();

    let length = raw.length;
    let buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = raw.charCodeAt(i);
    }

    let blob = new Blob([buffer]);
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.getKey() + ((this.state.data.syntax.extension) ? '.' + this.state.data.syntax.extension : '');
    link.click();
  }

  copyPaste = () => {
    let ele = document.createElement('a');
    new Clipboard(ele, {
      action: 'copy',
      text: () => this.getRawContent()
    });
    ele.click();
  }

  render() {
    return (
			<main class="home">
        <section>
					<style dangerouslySetInnerHTML={{ __html: (this.state.themeCss) ? this.state.themeCss : '' }} />
					<div class="s_h" dangerouslySetInnerHTML={{ __html: this.state.content }} />
				</section>
			</main>
    );
  }
}
