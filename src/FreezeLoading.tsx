import React from "react";

export namespace FreezeLoading {
	export interface Properties {
		text?: string;
	}
}

export function FreezeLoading(props: FreezeLoading.Properties): JSX.Element {
	return (
		<div className="cover">
			<div
				className="spinner"
				data-label={props.text}
			/>
		</div>
	);
}
