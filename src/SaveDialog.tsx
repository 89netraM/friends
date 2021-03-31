import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";
import { FreezeLoading } from "./FreezeLoading";
import { Person } from "./Person";
import { Storage } from "./Storage";
import { i18n } from "./i18n";

export async function SaveDialog(suggestedName: string, model: ReadonlyArray<Readonly<Person.Properties>>): Promise<string> {
	const container = document.createElement("div");
	document.body.append(container);

	const existingNames = await Storage.GetAvailableModels();

	const name = await new Promise<string>(resolve => {
		let name: string = null;
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title={i18n.GetPhrase("saveNetwork")}
				accept={i18n.GetPhrase("save")}
				onAccept={() => name == null || name.length > 0 ? (ReactDOM.unmountComponentAtNode(container), resolve(name ?? suggestedName)) : null}
				cancel={i18n.GetPhrase("cancel")}
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
						<span>{i18n.GetPhrase("fileName")}:</span>
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
						title={i18n.GetPhrase("overwriteNetwork")}
						accept={i18n.GetPhrase("overwrite")}
						onAccept={() => (ReactDOM.unmountComponentAtNode(container), resolve(true))}
						cancel={i18n.GetPhrase("cancel")}
						onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(false))}
					>
						<p>
							{i18n.GetPhrase("networkAlreadyExists")}<br/>
							{i18n.GetPhrase("wishToOverwrite")}
						</p>
					</Dialog>,
					container
				);
			});
		}

		if (shouldWrite) {
			ReactDOM.render(<FreezeLoading text={i18n.GetPhrase("saving")}/>, container);
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
							title={i18n.GetPhrase("failedToSave")}
							cancel={i18n.GetPhrase("acceptFailure")}
							onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve())}
						>
							<p>{i18n.GetPhrase("failedToSave.description")}</p>
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
