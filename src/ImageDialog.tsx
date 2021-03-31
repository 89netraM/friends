import React from "react";
import ReactDOM from "react-dom"
import { Dialog } from "./Dialog";

export function ImageDialog(): Promise<Blob | null> {
	return new Promise<Blob | null>(resolve => {
		let file: File = null;

		let input: HTMLInputElement;
		const container = document.createElement("div");
		document.body.append(container);
		ReactDOM.render(
			<Dialog
				isOpen={true}
				title="Upload Image"
				accept="Done"
				onAccept={() => file != null ? (ReactDOM.unmountComponentAtNode(container), resolve(file)) : null}
				cancel="Cancel"
				onCancel={() => (ReactDOM.unmountComponentAtNode(container), resolve(null))}
			>
				<p>
					<label className="file">
						<button
							className="primary"
							onClick={() => input.click()}
						>Select Image</button>
						<input
							ref={i => input = i}
							type="file"
							accept="image/*"
							required={true}
							onChange={e => e.target.files.length > 0 ? file = e.target.files.item(0) : null}
						/>
						<span
							data-no-file="No file selected"
							data-selected-file="File selected"
						></span>
					</label>
				</p>
			</Dialog>,
			container
		);
	});
}
