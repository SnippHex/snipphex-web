import { h, Component } from 'preact';

export default class About extends Component {

  render() {
    return (
      <main class="default about">
        <section>
          <h1>Open-source project</h1>
          <p><strong>Github repository API: </strong><a href="https://github.com/david-szabo97/snipphex">https://github.com/david-szabo97/snipphex</a></p>
          <p><strong>Github repository front-end: </strong><a href="https://github.com/david-szabo97/snipphex-web">https://github.com/david-szabo97/snipphex-web</a></p>
        </section>
      </main>
    );
  }

}
