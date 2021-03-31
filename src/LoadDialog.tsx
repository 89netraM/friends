import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";
import { FreezeLoading } from "./FreezeLoading";
import { Person } from "./Person";
import { Storage } from "./Storage";

export async function LoadDialog(): Promise<[string, ReadonlyArray<Readonly<Person.Properties>>]> {
	const container = document.createElement("div");
	document.body.append(container);

	const existingNames = await Storage.GetAvailableModels();

	const name = await new Promise<string>(resolve => {
		let name: string = "";
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title="Load Network"
				accept="Load"
				onAccept={() => name?.length > 0 ? (ReactDOM.unmountComponentAtNode(container), resolve(name)) : null}
				cancel="Cancel"
				onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(null))}
			>
				<p>
					<label>
						<span>Network:</span>
						<select
							defaultValue=""
							onChange={e => name = e.target.value}
						>
							<option
								hidden={true}
								value=""
							>Select a network</option>
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
		ReactDOM.render(<FreezeLoading text="Loading..."/>, container);
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
						title="Failed to load"
						cancel="Ok"
						onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve())}
					>
						<p>Something went wrong and we failed to load your network.</p>
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
