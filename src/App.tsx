import React, { Component, ReactNode } from "react";

export interface Properties {
}
interface State {
	navVisible: boolean;
}

export class App extends Component<Properties, State> {
	public constructor(props: Properties) {
		super(props);

		this.state = {
			navVisible: false,
		};
	}

	public render(): ReactNode {
		return (
			<>
				<header>
					<button
						className="expand-nav"
						onClick={() => this.setState({ navVisible: !this.state.navVisible })}
					></button>
					<h1>Friends</h1>
				</header>
				<nav className={this.state.navVisible ? "visible" : null}>
					<ul>
						<div className="marker"></div>
					</ul>
				</nav>
				<main>
				</main>
			</>
		);
	}
}
