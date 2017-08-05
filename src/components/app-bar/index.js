import { h, Component } from 'preact';
import { route } from 'preact-router';

export class AppBarMenuIcon extends Component {
  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    return (
      <div class="tooltip-target" onClick={this.onClick}>
        <span class="tooltip">{this.props.tooltip}</span>
        <i class="icon">{this.props.icon}</i>
      </div>
    );
  }
}

export default class AppBar extends Component {
  createMenuIcon(data) {
    return <AppBarMenuIcon onClick={data.onClick} id={data.id} tooltip={data.tooltip} icon={data.icon} />;
  }

  backToHome() {
    route('/');
  }

  render() {
    let title = (this.props.title) ? this.props.title : 'SnippHex';

    return (
      <header class="app-bar">
        <i id="side-bar-left" class="icon" onClick={this.props.onSideBarLeftToggle}>menu</i>
        <a href="javascript:void(0);" class="title" onClick={this.backToHome}>{title}</a>
        <span class="push-right" />
        {this.props.rightMenuIcons.map(v => this.createMenuIcon(v))}
        <i id="side-bar-right" class="icon" onClick={this.props.onSideBarRightToggle}>{this.props.rightSideBarToggleIcon}</i>
      </header>
    );
  }
}
