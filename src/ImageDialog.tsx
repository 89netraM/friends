import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";
import { i18n } from "./i18n";

export function ImageDialog(): Promise<Blob | null> {
	return new Promise<Blob | null>(resolve => {
		let file: File = null;

		let input: HTMLInputElement;
		const container = document.createElement("div");
		document.body.append(container);
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title={i18n.GetPhrase("uploadImage")}
				accept={i18n.GetPhrase("done")}
				onAccept={() => file != null ? (ReactDOM.unmountComponentAtNode(container), resolve(file)) : null}
				cancel={i18n.GetPhrase("cancel")}
				onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(null))}
			>
				<p>
					<label className="file">
						<button
							className="primary"
							onClick={() => input.click()}
						>{i18n.GetPhrase("selectImage")}</button>
						<input
							ref={i => input = i}
							type="file"
							accept="image/*"
							required={true}
							onChange={e => e.target.files.length > 0 ? file = e.target.files.item(0) : null}
						/>
						<span
							data-no-file={i18n.GetPhrase("noFileSelected")}
							data-selected-file={i18n.GetPhrase("fileSelected")}
						></span>
					</label>
				</p>
			</Dialog>,
			container
		);
	});
}
