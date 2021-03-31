import React, { Component, ReactNode } from "react";
import { Edge, Node } from "vis-network/peer";
import VisNetworkReact from "vis-network-react";
import { Person } from "./Person"
import brokenImage from "./static/brokenImage.svg"

export namespace Network {
	export interface Properties {
		persons: ReadonlyArray<Readonly<Person.Properties>>;
	}
}
interface State {
	nodes: ReadonlyMap<string, Node>;
	edges: ReadonlyMap<string, Edge>;
}

export class Network extends Component<Network.Properties, State> {
	private static constructState(props: Network.Properties): State {
		return {
			edges: new Map<string, Edge>(props.persons.flatMap(p => p.friends.map(([id, _]) => ({
				from: p.id,
				to: id,
			}))).map(e => [`${e.from}-${e.to}`, e])),
			nodes: new Map<string, Node>(props.persons.map(p => ({
				id: p.id,
				label: p.name,
				image: p.image?.[1] ?? brokenImage,
			})).map(n => [n.id, n])),
		};
	}
	private static compareStates(a: Readonly<State>, b: Readonly<State>): boolean {
		if (a.edges.size !== b.edges.size || a.nodes.size !== b.nodes.size) {
			return false;
		}

		for (const key of a.edges.keys()) {
			if (!b.edges.has(key)) {
				return false;
			}
		}

		for (const [key, aValue] of a.nodes) {
			const bValue = b.nodes.get(key);
			if (bValue == null ||
				aValue.label !== bValue.label ||
				aValue.image !== bValue.image
			) {
				return false;
			}
		}

		return true;
	}

	public constructor(props: Network.Properties) {
		super(props);

		this.state = Network.constructState(this.props);
	}

	public componentDidUpdate(prevProps: Readonly<Network.Properties>, prevState: Readonly<State>): void {
		if (prevProps !== this.props) {
			const nextState = Network.constructState(this.props);
			if (!Network.compareStates(prevState, nextState)) {
				this.setState(nextState);
			}
		}
	}

	public render(): ReactNode {
		const style = getComputedStyle(document.documentElement);
		const color = style.getPropertyValue("--color");
		const accent = style.getPropertyValue("--accent");
	
		return <VisNetworkReact
			data={{
				edges: new Array<Edge>(...this.state.edges.values()),
				nodes: new Array<Node>(...this.state.nodes.values()),
			}}
			options={{
				edges: {
					arrows: {
						to: {
							enabled: true,
							scaleFactor: 0.75,
						},
					},
					chosen: false,
					color: color,
					length: 200,
				},
				nodes: {
					font: {
						color: color,
					},
					color: accent,
					shape: "circularImage",
				},
			}}
		/>;
	}
}
