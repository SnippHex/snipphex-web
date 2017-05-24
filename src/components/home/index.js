import { h, Component } from 'preact';
import style from './style.sass';

export default class Home extends Component {
	render() {
		return (
			<div class={style.home}>
				<h1>Home</h1>
			</div>
		);
	}
}
