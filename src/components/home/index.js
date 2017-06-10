import { h, Component } from 'preact';
import AutoComplete from '../autocomplete';
import { route } from 'preact-router';
import nicetime from 'nicetime';
import formatSize from 'formatsize';
import base64EncodeUnicode from 'base64encode';
import Store from 'store';
import * as CpVault from 'cpvault';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      uploading: false,
      inputCode: '',
      inputTitle: '',
      inputSyntax: null,
      syntaxes: [],
      latestPastes: []
    };
  }

  componentDidMount() {
    Store.sideBars.right.title = 'Latest cps';
    Store.update();

    CpVault.getSyntaxes().then((res) => this.setState({ syntaxes: res.data }));
    CpVault.getLatestPastes().then(res => {
      const pastes = res.data;
      this.setState({ latestPastes: pastes });

      Store.sideBars.right.children = pastes.map(cp => this.makeLatestCpItem(cp));
      Store.update();
    });
  }

  handleCpItemClick(cp) {
    route(`/${cp.key}`);
  }

  shortenMoment(str) {
    return str
			.replace('seconds', 'sec').replace('second', 'sec')
			.replace('minutes', 'min').replace('minute', 'min')
			.replace('hours', 'hr').replace('hour', 'hr');
  }

  makeLatestCpItem(cp) {
    return (
			<div onClick={() => this.handleCpItemClick(cp)} class="latest-cp">
				<span>{cp.title}</span>
				<small>{formatSize(cp.size)}</small>
				<small>{cp.syntaxName} | {this.shortenMoment(nicetime(cp.createdAt * 1000))}</small>
			</div>
    );
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
