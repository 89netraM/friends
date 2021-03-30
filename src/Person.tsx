import React from "react";

export namespace Person {
	export interface Properties {
		id: string;
		name: string;
		friends: ReadonlyArray<[string, string]>;
		isOpen: boolean;
		onToggle?: (id: string) => void;
		onNameChange?: (id: string, newName: string) => void;
		onRemoved?: (id: string) => void;
		onFriendRemoved?: (id: string, friendId: string) => void;
		onFriendAdded?: (id: string, friendName: string) => void;
	}
}

export function Person(props: Readonly<Person.Properties>): JSX.Element {
	let newFriendText: HTMLInputElement;

	return (
		<details
			open={props.isOpen}
			onClick={e => {
				if (!props.isOpen|| (e.target as Node).nodeName === "SUMMARY") {
					e.preventDefault();
					props.onToggle?.(props.id);
				}
			}}
		>
			<summary>{
				!props.isOpen ?
					<div>
						<span>{props.name}</span>
						<span>{props.friends.length} friend(s)</span>
					</div> :
					<div>
						<input
							type="text"
							value={props.name}
							onChange={e => props.onNameChange?.(props.id, e.currentTarget.value)}
						/>
						<button
							className="danger icon"
							onClick={() => props.onRemoved?.(props.id)}
						>🗑️</button>
					</div>
			}</summary>
			<div>
				<h3>Friends:</h3>
				<ul>
					{
						props.friends.map(([id, friend]) =>
							<li key={id}>
								<span>{friend}</span>
								<button
									className="danger icon"
									onClick={() => props.onFriendRemoved?.(props.id, id)}
								>🗑️</button>
							</li>
						)
					}
				</ul>
				<div>
					<input
						ref={e => newFriendText = e}
						type="text"
						placeholder="Add a friend"
						defaultValue=""
						list="person-list"
						onKeyDown={e => {
							if (e.key === "Enter") {
								props.onFriendAdded?.(props.id, newFriendText.value);
								newFriendText.value = "";
							}
						}}
					/>
					<button
						className="primary icon"
						onClick={() => {
							props.onFriendAdded?.(props.id, newFriendText.value);
							newFriendText.value = "";
						}}
					>➕</button>
				</div>
			</div>
		</details>
	);
}
