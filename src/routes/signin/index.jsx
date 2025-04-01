import styles from "./styles.module.css";
import { LogoFull } from "../../assets";
import { SigninForm } from "./components";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Signin = () => {
	const isloggedIn = useSelector((state) => !!state?.user?.value?.jwt);
	if (isloggedIn) {
		return <Navigate to="/dashboard" />;
	}
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header>
					<Link to="#">
						<LogoFull />
					</Link>
				</header>
				<div className={styles.formContainer}>
					<h1>Sign in using your social account.</h1>
					<p>
						Connect your social account to access your Chaincrib
						account.
					</p>
					<SigninForm />
				</div>
			</div>
		</main>
	);
};
