import styles from "./styles.module.css";
import { LogoFull } from "../../assets";
import { SignupForm } from "./components";
import { Link } from "react-router-dom";

export const Signup = () => {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header>
					<Link to="/signin">
						<LogoFull />
					</Link>
				</header>
				<div className={styles.formContainer}>
					<h1>Let&apos;s get you started</h1>
					<p>
						Provide your email address, we will send you a one-time
						merge link to continue
					</p>
					<SignupForm />
					<p>
						Already have an account?{"  "}
						<Link to="/signin">Sign in</Link>
					</p>
				</div>
			</div>
		</main>
	);
};
