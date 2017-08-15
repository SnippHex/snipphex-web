import { h, Component } from 'preact';

export default class About extends Component {

  render() {
    return (
      <main class="default about">
        <section>
          <h1>Open-source project</h1>
          <p><strong>Github repository API: </strong><a href="https://github.com/SnippHex/snipphex">https://github.com/SnippHex/snipphex</a></p>
          <p><strong>Github repository front-end: </strong><a href="https://github.com/SnippHex/snipphex-web">https://github.com/SnippHex/snipphex-web</a></p>
          <p><strong>Version: </strong>{ __VERSION__ }</p>
          <p><strong>Build date: </strong>{ __BUILD_DATE__ }</p>
        </section>
      </main>
    );
  }

}
