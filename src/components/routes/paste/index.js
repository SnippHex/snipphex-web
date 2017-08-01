import { h, Component } from 'preact';
import copyText from 'copytext';
import downloadText from 'downloadtext';
import nicetime from 'nicetime';
import formatSize from 'formatsize';
import * as SnippEX from 'snippex';
import Store from 'store';

export default class Paste extends Component {
  getKey() {
    return this.props.matches.key || this.props.key;
  }

  getCodeElementNode() {
    return this.codeContainerRef.querySelector('.code');
  }

  componentDidMount() {
    this.__isMounted = true;
    this.setState({ loading: true, error: null });

    Store.sideBars.right.children = [];
    Store.sideBars.right.title = 'Loading...';
    Store.title = '';
    Store.update();

    const key = this.getKey();

    Promise.all([
      SnippEX.getPaste(key),
      SnippEX.getPasteHtmlContent(key),
      Store.getThemeCss()
    ]).then((res) => {
      if (!this.__isMounted) {
        return;
      }

      const [data, html ,css] = [res[0].data, res[1], res[2]];

      this.setState({ data, content: html, themeCss: css, loading: false });

      // Setup title
      Store.title = data.title;

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
    }).catch(err => this.setState({ error: err }));

    Store.listen('theme', this.onThemeChange);
  }

  componentWillUnmount() {
    this.__isMounted = false;
    Store.sideBars.right.title = '';
    Store.sideBars.right.children = [];
    Store.resetAppBar();
    Store.remove('theme', this.onThemeChange);
  }

  onThemeChange = () => {
    Store.getThemeCss().then(css => this.setState({ themeCss: css }));
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
    const isLoading = this.state.loading;
    const isFetchFailed = this.state.error;

    if (isFetchFailed) {
      return (
        <main class="error">
          <section>
            <p>Too bad, we failed to get that cp for you</p>
            <i class="icon">sentiment_very_dissatisfied</i>
          </section>
        </main>
      );
    }

    if (isLoading) {
      return (
        <main class="loading">
          <section>
             <p>Loading the cp for you...</p>
            <div class="progress"><div class="indeterminate" /></div>
          </section>
        </main>
      );
    }

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
