import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

initNufiDappCardanoSdk(nufiCoreSdk, "sso");

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
	const [lastActivity, setLastActivity] = useState(Date.now());
	const [isIdle, setIsIdle] = useState(false);

	useEffect(() => {
		// Function to update last activity timestamp
		const updateLastActivity = () => {
			setLastActivity(Date.now());
			setIsIdle(false);
		};

		// Add event listeners for user activity
		const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
		events.forEach(event => {
			window.addEventListener(event, updateLastActivity);
		});

		// Handle visibility change
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				updateLastActivity();
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		const idleCheckInterval = setInterval(() => {
			const currentTime = Date.now();
			const idleTime = currentTime - lastActivity;
			
			// If idle for more than 1 minute and tab is visible
			if (idleTime > 60000 && document.visibilityState === 'visible' && !isIdle) {
				setIsIdle(true);
				dispatch(removeUser());
				window.location.replace("/");
			}
		}, 10000);

		// Cleanup event listeners and interval
		return () => {
			events.forEach(event => {
				window.removeEventListener(event, updateLastActivity);
			});
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			clearInterval(idleCheckInterval);
		};
	}, [dispatch, lastActivity, isIdle]);

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
