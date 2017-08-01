import { h, Component } from 'preact';

export class SelectItem extends Component {
  onItemClick = () => {
    this.props.onItemClick(this.props.data);
  }

  render() {
    let classes = "select__item";
    if (this.props.active) {
      classes += " select__item--active";
    }

    return (<div class={classes} onClick={this.onItemClick}>{this.props.name}</div>);
  }
}

export default class Select extends Component {

  componentWillReceiveProps(nextProps) {
    if (!this.state.input ||
        this.props.default !== nextProps.default ||
        this.props.data !== nextProps.data ||
        this.props.itemNameProp !== nextProps.itemNameProp) {
      this.setState({ input: nextProps.default || nextProps.data[0][nextProps.itemNameProp] });
    }
  }

  onItemClick = data => {
    this.setState({ input: data[this.props.itemNameProp] });

    if (this.props.onItemClick) {
      this.props.onItemClick(data);
    }

    if (this.props.onItemChange) {
      this.props.onItemChange(data);
    }
  }

  createItem(data, active) {
    return <SelectItem onItemClick={this.onItemClick} name={data[this.props.itemNameProp]} data={data} active={active} />;
  }

  render() {
    let classes = "select";
    if (this.props.disabled) {
      classes += " select--disabled";
    }

    return (
      <div class={classes}>
        {this.props.data.map(v => this.createItem(v, this.state.input === v[this.props.itemNameProp]))}
      </div>
    );
  }
}
