import { useEffect } from "react";

export const useEffectAsync = (func, deps = []) => {
	useEffect(() => {
		func();
	}, deps);
};
