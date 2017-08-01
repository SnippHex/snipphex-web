import { h, Component } from 'preact';
import AutoComplete from '../../autocomplete';
import Select from '../../select';
import { route } from 'preact-router';
import nicetime from 'nicetime';
import formatSize from 'formatsize';
import base64EncodeUnicode from 'base64encode';
import Store from 'store';
import * as CpVault from 'cpvault';

export class LatestCpItem extends Component {
  onItemClick = () => {
    this.props.onItemClick(this.props.data);
  }

  render() {
    return (
      <div onClick={this.onItemClick} class="latest-cp">
        <span>{this.props.data.title}</span>
        <small>{formatSize(this.props.data.size)}</small>
        <small>{this.props.data.syntaxName} | {nicetime(this.props.data.createdAt * 1000, undefined, true)}</small>
      </div>
    );
  }
}

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      uploading: false,
      inputCode: '',
      inputTitle: '',
      inputSyntax: null,
      syntaxes: []
    };
  }

  componentDidMount() {
    Store.title = '';
    this.__isMounted = true;
    this.setState({ loading: true });
    Store.sideBars.right.title = 'Latest cps';
    Store.sideBars.right.children = (
      <main class="loading">
        <section>
            <p>Loading...</p>
            <div class="progress"><div class="indeterminate" /></div>
        </section>
      </main>
    );
    Store.update();

    Store.getSyntaxes()
    .then((syntaxes) => this.setState({ syntaxes, loading: false }))
    .catch((err) => this.setState({ error: err }));
    Store.getLatests().then(pastes => {
      if (this.__isMounted) {
        Store.sideBars.right.children = pastes.map(cp => this.makeLatestCpItem(cp));
        Store.update();
      }
    }).catch(() => {
      if (this.__isMounted) {
        Store.sideBars.right.children = (
          <main class="error">
            <section>
              <p>Can't find those latests cps</p>
              <i class="icon">sentiment_very_dissatisfied</i>
            </section>
          </main>
        );
        Store.update();
      }
    });
  }

  componentWillUnmount() {
    this.__isMounted = false;
    Store.sideBars.right.title = '';
    Store.sideBars.right.children = [];
  }

  handleCpItemClick(cp) {
    route(`/p/${cp.key}`);
  }

  makeLatestCpItem(cp) {
    return <LatestCpItem data={cp} onItemClick={this.handleCpItemClick} />;
  }

  startUpload = () => {
    this.setState({ uploading: true });

    const data = {
      title: this.state.inputTitle,
      visibility: this.state.inputVisibility.value,
      syntaxId: (this.state.inputSyntax) ? this.state.inputSyntax.id : 1,
      content: base64EncodeUnicode(this.state.inputCode)
    };

    CpVault.uploadPaste(data).then(res => {
      this.setState({
        uploading: false,
        inputCode: '',
        inputTitle: '',
        inputSyntax: null
      });

      route('/p/' + res.data.key);
    }).catch(err => this.setState({ uploadError: err }));
  }

  onInputCodeChange = (e) => {
    this.setState({ inputCode: e.target.value });
  }

  onInputTitleChange = (e) => {
    this.setState({ inputTitle: e.target.value });
  }

  onInputSyntaxChange = (data) => {
    this.setState({ inputSyntax: (data) ? data : null });
  }

  onInputVisibilityChange = (data) => {
    this.setState({ inputVisibility: (data) ? data : null });
  }

  render() {
    const progressStyle = { visibility: (this.state.uploading) ? "visible" : "hidden" };
    const isLoading = this.state.loading;
    const isFetchFailed = this.state.error || this.state.uploadError;

    if (isFetchFailed) {
      return (
        <main class="error">
          <section>
            <p>Something bad happened reaching the server</p>
            <i class="icon">sentiment_very_dissatisfied</i>
          </section>
        </main>
      );
    }

    if (isLoading) {
      return (
        <main class="loading">
          <section>
             <p>Loading...</p>
             <div class="progress"><div class="indeterminate" /></div>
          </section>
        </main>
      );
    }

    return (
      <main class="default home">
        <section>
           <div class="upload-form">
            <h1>cpVault</h1>
            <h2>Upload a new paste</h2>
            <div class="box">
              <input type="text" placeholder="Title..." value={this.state.inputTitle} onChange={this.onInputTitleChange} disabled={this.state.uploading} />
              <AutoComplete placeholder="Syntax highlighting..." data={this.state.syntaxes} itemNameProp="name" onItemChange={this.onInputSyntaxChange} disabled={this.state.uploading} />
              <Select itemNameProp="name" data={Store.visibilities} onItemChange={this.onInputVisibilityChange} />
              <textarea placeholder="Code goes here..." value={this.state.inputCode} onChange={this.onInputCodeChange} disabled={this.state.uploading} />
              <button onClick={this.startUpload} disabled={this.state.uploading}>Upload</button>
              <div style={progressStyle} class="progress"><div class="indeterminate" /></div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
