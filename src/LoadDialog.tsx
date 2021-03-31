import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";
import { FreezeLoading } from "./FreezeLoading";
import { Person } from "./Person";
import { Storage } from "./Storage";
import { i18n } from "./i18n";

export async function LoadDialog(): Promise<[string, ReadonlyArray<Readonly<Person.Properties>>]> {
	const container = document.createElement("div");
	document.body.append(container);

	const existingNames = await Storage.GetAvailableModels();

	const name = await new Promise<string>(resolve => {
		let name: string = "";
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title={i18n.GetPhrase("loadNetwork")}
				accept={i18n.GetPhrase("load")}
				onAccept={() => name?.length > 0 ? (ReactDOM.unmountComponentAtNode(container), resolve(name)) : null}
				cancel={i18n.GetPhrase("cancel")}
				onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(null))}
			>
				<p>
					<label>
						<span>{i18n.GetPhrase("network")}:</span>
						<select
							defaultValue=""
							onChange={e => name = e.target.value}
						>
							<option
								hidden={true}
								value=""
							>{i18n.GetPhrase("selectNetwork")}</option>
							{
								existingNames.map(n =>
									<option
										key={n}
										value={n}
									>{n}</option>
								)
							}
						</select>
					</label>
				</p>
			</Dialog>,
			container
		);
	});

	if (name != null) {
		ReactDOM.render(<FreezeLoading text={i18n.GetPhrase("loading")}/>, container);
		const [model, _] = await Promise.all([
			Storage.LoadModel(name),
			new Promise<void>(r => setTimeout(r, 350)), // Artificial loading time
		]);
		ReactDOM.unmountComponentAtNode(container);

		if (model != null) {
			container.remove();
			return [name, model];
		}
		else {
			await new Promise<void>(resolve => {
				ReactDOM.render(
					<Dialog
						isOpen={true}
						title={i18n.GetPhrase("failedToLoad")}
						cancel={i18n.GetPhrase("acceptFailure")}
						onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve())}
					>
						<p>{i18n.GetPhrase("failedToLoad.description")}</p>
					</Dialog>,
					container
				);
			});

			container.remove();
			return null;
		}
	}
	else {
		container.remove();
		return null;
	}
}
