import { h, Component } from 'preact';
import AutoComplete from '../autocomplete';
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
    Store.sideBars.right.title = 'Latest cps';
    Store.update();

    Store.getSyntaxes().then((syntaxes) => this.setState({ syntaxes }));
    Store.getLatests().then(pastes => {
      Store.sideBars.right.children = pastes.map(cp => this.makeLatestCpItem(cp));
      Store.update();
    });
  }

  handleCpItemClick(cp) {
    route(`/${cp.key}`);
  }

  makeLatestCpItem(cp) {
    return <LatestCpItem data={cp} onItemClick={this.handleCpItemClick} />;
  }

  startUpload = () => {
    this.setState({ uploading: true });

    const data = {
      title: this.state.inputTitle,
      visibility: 0,
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

      route('/' + res.data.key);
    });
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

  render() {
    const progressStyle = { visibility: (this.state.uploading) ? "visible" : "hidden" };

    return (
      <main class="home">
        <section>
           <div class="upload-form">
            <h1>cpVault</h1>
            <span class="title">Upload a new paste</span>
            <div class="box">
              <input type="text" placeholder="Title..." value={this.state.inputTitle} onChange={this.onInputTitleChange} disabled={this.state.uploading} />
              <AutoComplete placeholder="Syntax highhlighting..." data={this.state.syntaxes} itemNameProp="name" onItemChange={this.onInputSyntaxChange} disabled={this.state.uploading} />
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
