import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import Scarford from "./scarford";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
	Dashboard,
	InvestmentId,
	Portfolio,
	PortfolioId,
	Transactions,
	Profile,
	Signin,
	Investment,
} from "./routes";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { initNufiDappCardanoSdk } from "@nufi/dapp-client-cardano";
import { useDispatch } from "react-redux";
import { removeUser } from "./redux/slices";

nufiCoreSdk.init("https://wallet-testnet-staging.nu.fi", {
	responsive: true,
	colorMode: "dark",
	zIndex: 9999,
});

const router = createBrowserRouter([
	{ path: "/signin", element: <Signin /> },
	{
		path: "/",
		element: <Scarford />,
		children: [
			{
				index: true,
				element: <Navigate to="/signin" replace />,
			},
			{
				path: "/dashboard",
				element: <Dashboard />,
			},
			{
				path: "/portfolio",
				element: <Portfolio />,
			},
			{
				path: "/portfolio/:id",
				element: <PortfolioId />,
			},
			{
				path: "/investment",
				element: <Investment />,
			},
			{
				path: "/investment/:id",
				element: <InvestmentId />,
			},
			{
				path: "/transactions",
				element: <Transactions />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
		],
	},
]);

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		initNufiDappCardanoSdk(nufiCoreSdk, "sso");
	}, []);

	nufiCoreSdk.onSocialLoginInfoChanged((data) => {
		if (!data) {
			dispatch(removeUser());
			window.location.replace("/");
		}
	});

	return (
		<>
			<Toaster
				toastOptions={{
					style: {
						fontFamily: ' "Source Sans 3", sans-serif',
						fontWeight: 600,
						fontSize: 14,
					},
				}}
			/>
			<RouterProvider router={router} />;
		</>
	);
}

export default App;
