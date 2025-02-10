import { forwardRef, useImperativeHandle, useState } from "react";

const Togglable = forwardRef((props, ref) => {
	const { children, visibleLabel, hideLabel = "cancel" } = props;
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		setVisible(!visible);
	};

	useImperativeHandle(ref, () => {
		return {
			toggleVisible,
		};
	});

	return (
		<div>
			{visible && <>{children}</>}
			<br />
			<button onClick={toggleVisible}>
				{visible ? hideLabel : visibleLabel}
			</button>
		</div>
	);
});

Togglable.displayName = "Togglable";

export { Togglable };
