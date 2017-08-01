import { h, Component } from 'preact';
import AutoComplete from '../../autocomplete';
import Store from 'store';

export default class Settings extends Component {
  constructor() {
    super();

    this.state = {
      themes: [],
      themeDefault: 'Loading...',
      themeDisabled: true
    };
  }

  componentDidMount() {
    Store.title = 'Settings';
    Store.update();
    Store.getThemes().then(themes => this.setState({
      themes: themes.map(name => ({ name })),
      themeDefault: Store.theme,
      themeDisabled: false
    }));
  }

  onInputThemeChange = (data) => {
    this.setState({ selectedTheme: data });
  }

  doSave = () => {
    if (this.state.selectedTheme) {
      this.setState({ isSaving: true });
      this.setState({ themeDisabled: true });

      Store.changeTheme(this.state.selectedTheme.name).then(() => {
        this.setState({ themeDisabled: false, isSaving: false });
      });
    }
  }

  render() {
    return (
      <main class="default settings">
        <section>
          <h1>Settings</h1>

          <h2>Syntax Highlighting Theme</h2>
          <div class="box">
            <AutoComplete default={this.state.themeDefault} data={this.state.themes} itemNameProp="name" onItemChange={this.onInputThemeChange} disabled={this.state.themeDisabled} />
          </div>

          <div class="box settings__save">
            <button onClick={this.doSave} class="button" disabled={this.state.isSaving}>{(this.state.isSaving) ? 'Saving...' : 'Save'}</button>
          </div>
        </section>
      </main>
    );
  }
}
