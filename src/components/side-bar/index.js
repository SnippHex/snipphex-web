import { h, Component } from 'preact';

export default class SideBar extends Component {
  render() {
    let typeClass = (this.props.left) ? ' side-bar-left' : (this.props.right) ? ' side-bar-right' : '';

    return (
      <aside class={'side-bar' + typeClass}>
        <span class="title">{this.props.title}</span>
        <hr />
        {this.props.children}
      </aside>
    );
  }
}
