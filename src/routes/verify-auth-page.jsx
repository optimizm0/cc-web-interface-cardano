import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { addUser } from "src/redux/slices";

export function VerifyAuthPage() {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathArray = location?.pathname?.split("/");
		const token = pathArray?.[pathArray?.length - 1];
		dispatch(addUser({ token }));
		navigate("/dashboard");
	}, [dispatch, location?.pathname, navigate]);

	return <div></div>;
}
