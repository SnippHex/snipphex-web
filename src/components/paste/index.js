import { h, Component } from 'preact';
import copyText from 'copytext';
import downloadText from 'downloadtext';
import nicetime from 'nicetime';
import formatSize from 'formatsize';
import * as CpVault from 'cpvault';
import Store from 'store';

export default class Paste extends Component {
  getKey() {
    return this.props.matches.key || this.props.key;
  }

  getCodeElementNode() {
    return this.codeContainerRef.querySelector('.code');
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
    const codeEle = this.getCodeElementNode();
    const linesEle = this.codeContainerRef.querySelector('.line-numbers-rows');

    codeEle.addEventListener('scroll', () => {
      linesEle.style.transform = 'translateY(' + -codeEle.scrollTop + 'px)';
    });
  }

  getRawContent() {
    return this.getCodeElementNode().textContent;
  }

  downloadPaste = () => {
    const fileName = this.getKey() + ((this.state.data.syntax.extension) ? '.' + this.state.data.syntax.extension : '');
    const raw = this.getRawContent();

    downloadText(fileName, raw);
  }

  copyPaste = () => {
    copyText(this.getRawContent());
  }

  render() {
    return (
			<main class="paste">
        <section>
					<style dangerouslySetInnerHTML={{ __html: (this.state.themeCss) ? this.state.themeCss : '' }} />
					<div ref={ele => this.codeContainerRef = ele} class="s_h" dangerouslySetInnerHTML={{ __html: this.state.content }} />
				</section>
			</main>
    );
  }
}
