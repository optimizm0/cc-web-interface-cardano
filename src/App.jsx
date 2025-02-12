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
import { magicInstance } from "./utils";

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

magicInstance.user.onUserLoggedOut(() => {
	// Do something when user is logged out
	window.location.replace("/signin");
});

function App() {
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
