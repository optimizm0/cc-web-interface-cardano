import { useState } from "react";
import { Hamburger, LogoFull, avatar } from "./assets";
import { Navbar, Sidebar } from "./components";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Scarford = () => {
	const isloggedIn = useSelector((state) => !!state?.user?.value?.jwt);
	const [showSmallNav, setShowSmallNav] = useState(false);
	const [showSmallSideBar, setShowSmallSideBar] = useState(false);

	if (!isloggedIn) {
		return <Navigate to="/signin" />;
	}

	return (
		<>
			<div className="mobile-navigations">
				<button onClick={() => setShowSmallNav(true)}>
					<Hamburger className="hamburger-icon" />
				</button>
				<LogoFull className="mobile-nav-logo" />
				<button
					className="sidebar-trigger"
					onClick={() => setShowSmallSideBar(true)}
				>
					<img
						src={avatar}
						alt="avatar"
						style={{ width: 40, height: 40 }}
						loading="eager"
					/>
				</button>
			</div>
			<div className="app-contents">
				<Navbar
					showSmallNav={showSmallNav}
					setShowSmallNav={setShowSmallNav}
				/>
				<div className="app-pages">
					<Outlet />
				</div>
				<div className="layout-sidebar">
					<Sidebar
						showSmallSideBar={showSmallSideBar}
						setShowSmallSideBar={setShowSmallSideBar}
					/>
				</div>
			</div>
		</>
	);
};

export default Scarford;
