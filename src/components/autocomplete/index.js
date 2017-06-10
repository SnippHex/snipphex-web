import { h, Component } from 'preact';

export class AutoCompleteItem extends Component {
	onItemClick = () => {
		this.props.onItemClick(this.props.data);
	}

	render() {
		return (<div class="autocomplete__item" onClick={this.onItemClick}>{this.props.name}</div>);
	}
}

export default class AutoComplete extends Component {
	constructor() {
		super();

		this.state = {
			input: '',
			focus: false
		};
	}

	onItemClick = data => {
		this.setState({ input: data[this.props.itemNameProp], focus: false, mouseIn: false });

		if (this.props.onItemClick) {
			this.props.onItemClick(data);
		}

		if (this.props.onItemChange) {
			this.props.onItemChange(data);
		}
	}

	createItem(data) {
		return <AutoCompleteItem onItemClick={this.onItemClick} name={data[this.props.itemNameProp]} data={data} />;
	}

	onInputInput = (e) => {
		this.setState({ input: e.target.value });

		if (this.props.onItemChange) {
			const valLower = e.target.value.toLowerCase();
			const item = this.props.data.find(v => v[this.props.itemNameProp].toLowerCase() === valLower);

			if (item) {
				this.props.onItemChange(item);
			} else {
				this.props.onItemChange(undefined);
			}
		}
	}

	onInputFocus = () => {
		this.setState({ focus: true });
	}

	onInputBlur = () => {
		this.setState({ focus: false });
	}

	onContainerMouseEnter = () => {
		this.setState({ mouseIn: true });
	}

	onContainerMouseLeave = () => {
		this.setState({ mouseIn: false });
	}

	getFilteredItems = () => {
		const notHasInput = this.state.input.length === 0;
		const input = this.state.input.toLowerCase();

		return this.props.data.filter(v => notHasInput || v[this.props.itemNameProp].toLowerCase().indexOf(input) !== -1);
	}

	render() {
		const containerDisplay = ((this.state.focus || this.state.mouseIn) && !this.props.disabled) ? "block" : "none";

		return (
			<div class="autocomplete">
				<input disabled={this.props.disabled} type="text" placeholder={this.props.placeholder} onInput={this.onInputInput} value={this.state.input} onFocus={this.onInputFocus} onBlur={this.onInputBlur} />
				<div class="autocomplete__container" style={{display: containerDisplay}} onMouseEnter={this.onContainerMouseEnter} onMouseLeave={this.onContainerMouseLeave}>
					{this.getFilteredItems().map(v => this.createItem(v))}
				</div>
			</div>
		);
	}
}
