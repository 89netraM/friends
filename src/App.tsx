import React, { Component, ReactNode } from "react";
import { Person } from "./Person";
import { uuid } from "./utils";
import VisNetwork from "vis-network-react";
import { Network } from "./Netwok";

export interface Properties {
}
interface State {
	navVisible: boolean;
	persons: ReadonlyArray<Readonly<Person.Properties>>;
	newPersonName: string;
	newPersonValid: boolean;
}

export class App extends Component<Properties, State> {
	private static sortPersons(persons: Array<Readonly<Person.Properties>>): void {
		persons.sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1);
	}

	public constructor(props: Properties) {
		super(props);

		this.state = {
			navVisible: false,
			persons: [
				{
					id: "0",
					name: "Hanna",
					friends: new Array<[string, string]>(["1", "Mårten"]),
					isOpen: false,
				},
				{
					id: "1",
					name: "Mårten",
					friends: new Array<[string, string]>(["0", "Hanna"]),
					isOpen: false,
				},
			],
			newPersonName: "",
			newPersonValid: true,
		};

		this.onPersonToggle = this.onPersonToggle.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onRemoved = this.onRemoved.bind(this);
		this.onFriendRemoved = this.onFriendRemoved.bind(this);
		this.onNewFriendChange = this.onNewFriendChange.bind(this);
		this.onFriendAdded = this.onFriendAdded.bind(this);
		this.onNewPersonChange = this.onNewPersonChange.bind(this);
		this.addNewPerson = this.addNewPerson.bind(this);
	}

	private onPersonToggle(id: string): void {
		this.setState(s => ({
			persons: s.persons.map(p => ({ ...p, isOpen: p.id === id ? !p.isOpen : false, })),
		}));
	}

	private onNameChange(id: string, newName: string): void {
		this.setState(s => ({
			persons: s.persons.map(p => ({
				...p,
				name: p.id === id ? newName : p.name,
				friends: p.friends.map(([i, f]) => [i, i === id ? newName : f]),
			})),
		}));
	}

	private onRemoved(id: string): void {
		this.setState(s => ({
			persons: s.persons
				.filter(p => p.id !== id)
				.map(p => ({ ...p, friends: p.friends.filter(([i, _]) => i !== id), })),
		}));
	}

	private onFriendRemoved(id: string, friendId: string): void {
		this.setState(s => ({
			persons: s.persons.map(p => ({
				...p,
				friends: p.id !== id ? p.friends : p.friends.filter(([i, _]) => i !== friendId),
			})),
		}));
	}

	private onNewFriendChange(id: string, newNewFriendName: string): void {
		this.setState(s => ({
			persons: s.persons.map(p => p.id !== id ? p : {
				...p,
				newFriendName: newNewFriendName,
				newFriendValid: p.name !== newNewFriendName && p.friends.every(([_, f]) => f !== newNewFriendName),
			}),
		}));
	}

	private onFriendAdded(id: string): void {
		this.setState(s => {
			const friendName = s.persons.find(p => p.id === id).newFriendName;
			let friendId = s.persons.find(p => p.name === friendName)?.id;
			const persons = new Array<Readonly<Person.Properties>>(...s.persons);
			if (friendId == null) {
				friendId = uuid();
				persons.push({
					id: friendId,
					name: friendName,
					friends: new Array<[string, string]>(),
					isOpen: false,
				});
				App.sortPersons(persons);
			}
			return {
				persons: persons.map(p => p.id !== id ? p : {
					...p,
					friends: new Array<[string, string]>(...p.friends, [friendId, friendName]),
					newFriendName: "",
					newFriendValid: true,
				}),
			};
		});
	}

	private onNewPersonChange(newNewPersonName: string): void {
		this.setState(s => ({
			newPersonName: newNewPersonName,
			newPersonValid: s.persons.every(p => p.name !== newNewPersonName),
		}));
	}

	private addNewPerson(): void {
		this.setState(s => {
			if (s.newPersonValid && s.newPersonName.length > 0) {
				const persons = new Array<Readonly<Person.Properties>>(...s.persons);
				persons.push({
					id: uuid(),
					name: s.newPersonName,
					friends: new Array<[string, string]>(),
					isOpen: false,
				});
				App.sortPersons(persons);
				return {
					persons,
					newPersonName: "",
					newPersonValid: true,
				} as Properties;
			}
			else {
				return s;
			}
		});
	}

	public render(): ReactNode {
		return (
			<>
				<header>
					<button
						className="expand-nav"
						onClick={() => this.setState(s => ({ navVisible: !s.navVisible }))}
					></button>
					<h1>Friends</h1>
				</header>
				<nav className={this.state.navVisible ? "visible" : null}>
					<datalist id="person-list">
						{
							this.state.persons.map(person =>
								<option
									key={person.id}
									value={person.name}
								/>
							)
						}
					</datalist>
					{
						this.state.persons.map(person =>
							<Person
								key={person.id}
								{...person}
								onToggle={this.onPersonToggle}
								onNameChange={this.onNameChange}
								onRemoved={this.onRemoved}
								onFriendRemoved={this.onFriendRemoved}
								onNewFriendChange={this.onNewFriendChange}
								onFriendAdded={this.onFriendAdded}
							/>
						)
					}
					<div className="new-person">
						<label className={this.state.newPersonValid ? "" : "error"}>
							<span>Add a new person:</span>
							<input
								type="text"
								placeholder="New persons name"
								value={this.state.newPersonName}
								onChange={e => this.onNewPersonChange(e.target.value)}
								onKeyDown={e => e.key === "Enter" && this.addNewPerson()}
							/>
						</label>
						<button
							className="primary"
							disabled={!(this.state.newPersonValid && this.state.newPersonName.length > 0)}
							onClick={() => this.addNewPerson()}
						>Add</button>
					</div>
				</nav>
				<main>
					<Network
						persons={this.state.persons}
					/>
				</main>
			</>
		);
	}
}
