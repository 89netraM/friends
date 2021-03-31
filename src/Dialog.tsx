import React, { ReactNode, MouseEvent } from "react";

export namespace Dialog {
	export interface Properties {
		isOpen: boolean;
		title?: string;
		children?: ReactNode;
		accept?: string;
		onAccept?: () => void;
		cancel?: string;
		onCancel?: () => void;
	}
}

export function Dialog(props: Dialog.Properties): JSX.Element {
	function clickOnDialog(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
		if (e.target instanceof HTMLDivElement &&
			e.target.classList.contains("dialog")
		) {
			const rect = e.target.getBoundingClientRect();
			if (e.pageX < rect.left || rect.right < e.pageX ||
				e.pageY < rect.top || rect.bottom < e.pageY
			) {
				props.onCancel?.();
			}
		}
	}

	return (
		<div
			className="dialog"
			data-open={props.isOpen}
			onClick={clickOnDialog}
		>
			{
				props.title == null ? null :
				<header>{props.title}</header>
			}
			<main>
				{props.children}
			</main>
			{
				props.accept == null && props.cancel == null ? null :
				<footer>
					{
						props.accept == null ? null :
						<button
							className="primary"
							onClick={props.onAccept}
						>{props.accept}</button>
					}
					{
						props.cancel == null ? null :
						<button
							onClick={props.onCancel}
						>{props.cancel}</button>
					}
				</footer>
			}
		</div>
	);
}
