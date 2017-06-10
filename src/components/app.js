import { h, Component } from 'preact';
import { Router } from 'preact-router';

import AppBar from './app-bar';
import SideBar from './side-bar';
import Home from './home';
import Paste from './Paste';
import Store from 'store';

export default class App extends Component {
	constructor() {
		super();

		window.store = Store;
		this.state = {
			sideBarLeftToggle: false,
			sideBarRightToggle: false
		};

		Store.listen(() => {
			this.forceUpdate();
		});
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	onSideBarLeftToggle = () => {
		this.setState({ sideBarLeftToggle: !this.state.sideBarLeftToggle });
	}

	onSideBarRightToggle = () => {
		this.setState({ sideBarRightToggle: !this.state.sideBarRightToggle });
	}

	render() {
		let classes = ['app'];
		if (this.state.sideBarLeftToggle) classes.push('side-bar-left-toggle');
		if (this.state.sideBarRightToggle) classes.push('side-bar-right-toggle');

		return (
			<div id="app" class={classes.join(' ')}>
				<div class="dimmer" />
				<AppBar rightSideBarToggleIcon={Store.appBar.rightSideBarIcon} onSideBarLeftToggle={this.onSideBarLeftToggle} onSideBarRightToggle={this.onSideBarRightToggle} rightMenuIcons={Store.appBar.rightMenuIcons} />
				<SideBar left={true} title={Store.sideBars.left.title}>{Store.sideBars.left.children}</SideBar>
				<SideBar right={true} title={Store.sideBars.right.title}>{Store.sideBars.right.children}</SideBar>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Paste path="/:key" />
				</Router>
			</div>
		);
	}
}
