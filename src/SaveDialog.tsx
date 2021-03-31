import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";
import { FreezeLoading } from "./FreezeLoading";
import { Person } from "./Person";
import { Storage } from "./Storage";

export async function SaveDialog(suggestedName: string, model: ReadonlyArray<Readonly<Person.Properties>>): Promise<string> {
	const container = document.createElement("div");
	document.body.append(container);

	const existingNames = await Storage.GetAvailableModels();

	const name = await new Promise<string>(resolve => {
		let name: string = null;
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title="Save Network"
				accept="Save"
				onAccept={() => name == null || name.length > 0 ? (ReactDOM.unmountComponentAtNode(container), resolve(name ?? suggestedName)) : null}
				cancel="Cancel"
				onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(null))}
			>
				<p>
					<datalist id="model-list">
						{
							existingNames.map(n =>
								<option
									key={n}
									value={n}
								/>
							)
						}
					</datalist>
					<label>
						<span>Name:</span>
						<input
							type="text"
							defaultValue={suggestedName}
							list="model-list"
							onChange={e => name = e.target.value}
						/>
					</label>
				</p>
			</Dialog>,
			container
		);
	});

	if (name != null) {
		let shouldWrite = true;
		if (existingNames.some(n => n === name) && name !== suggestedName) {
			shouldWrite = await new Promise<boolean>(resolve => {
				ReactDOM.render(
					<Dialog
						isOpen={true}
						title="Overwrite Network"
						accept="Overwrite"
						onAccept={() => (ReactDOM.unmountComponentAtNode(container), resolve(true))}
						cancel="Cancel"
						onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(false))}
					>
						<p>
							A model with that name already exists.<br/>
							Do you wish to overwrite it?
						</p>
					</Dialog>,
					container
				);
			});
		}

		if (shouldWrite) {
			ReactDOM.render(<FreezeLoading text="Saving..."/>, container);
			const [success, _] = await Promise.all([
				Storage.SaveModel(name, model),
				new Promise(r => setTimeout(r, 350)), // Artificial loading time
			]);
			ReactDOM.unmountComponentAtNode(container);

			if (success) {
				container.remove();
				return name;
			}
			else {
				await new Promise<void>(resolve => {
					ReactDOM.render(
						<Dialog
							isOpen={true}
							title="Failed to save"
							cancel="Ok"
							onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve())}
						>
							<p>Something went wrong and we failed to save your network.</p>
						</Dialog>,
						container
					);
				});

				container.remove();
				return null;
			}
		}
	}
	else {
		container.remove();
		return null;
	}
}
