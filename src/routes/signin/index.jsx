import styles from "./styles.module.css";
import { LogoFull } from "../../assets";
import { SigninForm } from "./components";
import { Link } from "react-router-dom";

export const Signin = () => {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header>
					<Link to="#">
						<LogoFull />
					</Link>
				</header>
				<div className={styles.formContainer}>
					<h1>Link your email address</h1>
					<p>
						Provide your email address, we will send you a one-time
						merge link to continue
					</p>
					<SigninForm />
				</div>
			</div>
		</main>
	);
};
