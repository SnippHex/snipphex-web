import { h, Component } from 'preact';

export class SelectItem extends Component {
  onItemClick = () => {
    this.props.onItemClick(this.props.data);
  }

  render() {
    let classes = "select__item";
    if (this.props.data.active) {
      classes += " select__item--active";
    }

    return (<div class={classes} onClick={this.onItemClick}>{this.props.name}</div>);
  }
}

export default class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: props.default || this.props.data[0][this.props.itemNameProp]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.default !== this.props.default) {
      this.setState({ input: nextProps.default || '' });
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

  createItem(data) {
    return <SelectItem onItemClick={this.onItemClick} name={data[this.props.itemNameProp]} data={data} />;
  }

  render() {
    let classes = "select";
    if (this.props.disabled) {
      classes += " select--disabled";
    }

    return (
      <div class={classes}>
      </div>
    );
  }
}
