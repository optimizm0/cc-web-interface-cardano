import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { addUser } from "src/redux/slices";

export function GoogleAuthPage() {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		const pathArray = location?.pathname?.split("/");
		const token = pathArray?.[pathArray?.length - 1];
		dispatch(addUser({ token }));
		window.close();
	}, [dispatch, location?.pathname]);

	return <div></div>;
}
