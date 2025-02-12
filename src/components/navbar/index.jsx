import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";
import {
	WalletIcon,
	BriefCaseIcon,
	ChartIcon,
	HomeIcon,
	LogoFull,
	UserIcon,
	Close,
} from "../../assets";

// const userPaths = [{}];

export const Navbar = ({ showSmallNav = false, setShowSmallNav }) => {
	return (
		<div>
			<div className={styles.bigNav}>
				<header>
					<LogoFull />
				</header>
				<nav>
					<ul>
						<li>
							<NavLink
								to="/dashboard"
								className={({ isActive }) =>
									isActive ? styles.current : ""
								}
							>
								<HomeIcon />
								<span>Dashboard</span>
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/portfolio"
								className={({ isActive }) =>
									isActive ? styles.current : ""
								}
							>
								<BriefCaseIcon />
								<span>Portfolio</span>
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/investment"
								className={({ isActive }) =>
									isActive ? styles.current : ""
								}
							>
								<ChartIcon />
								<span>Investment</span>
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/transactions"
								className={({ isActive }) =>
									isActive ? styles.current : ""
								}
							>
								<WalletIcon />
								<span>Transactions</span>
							</NavLink>
						</li>
						<li>
							<NavLink
								to="profile"
								className={({ isActive }) =>
									isActive ? styles.current : ""
								}
							>
								<UserIcon />
								<span>Profile</span>
							</NavLink>
						</li>
					</ul>
				</nav>
			</div>
			<div
				className={`${styles.smallNav} ${
					showSmallNav ? styles.smallNavActive : ""
				}`}
			>
				<button
					className={styles.close}
					onClick={() => setShowSmallNav(false)}
				>
					<Close />
				</button>
				<div className={styles.smallNavContainer}>
					<header>
						<LogoFull />
					</header>
					<nav>
						<ul>
							<li>
								<NavLink
									onClick={() => setShowSmallNav(false)}
									to="/dashboard"
									className={({ isActive }) =>
										isActive ? styles.current : ""
									}
								>
									<HomeIcon />
									<span>Dashboard</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									onClick={() => setShowSmallNav(false)}
									to="/portfolio"
									className={({ isActive }) =>
										isActive ? styles.current : ""
									}
								>
									<BriefCaseIcon />
									<span>Portfolio</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									onClick={() => setShowSmallNav(false)}
									to="/investment"
									className={({ isActive }) =>
										isActive ? styles.current : ""
									}
								>
									<ChartIcon />
									<span>Investment</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									onClick={() => setShowSmallNav(false)}
									to="/transactions"
									className={({ isActive }) =>
										isActive ? styles.current : ""
									}
								>
									<WalletIcon />
									<span>Transactions</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									onClick={() => setShowSmallNav(false)}
									to="profile"
									className={({ isActive }) =>
										isActive ? styles.current : ""
									}
								>
									<UserIcon />
									<span>Profile</span>
								</NavLink>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
};
