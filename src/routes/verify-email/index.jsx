import styles from "./styles.module.css";
import { LogoFull, email } from "../../assets";
import { Link } from "react-router-dom";

export const VerifyEmail = () => {
	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header>
					<Link to="/signin">
						<LogoFull />
					</Link>
				</header>
				<div className={styles.contentContainer}>
					<img
						src={email}
						alt="email.png"
						style={{ width: 162, height: 129 }}
						loading="eager"
					/>
					<h1>You’ve got mail</h1>
					<p>
						Check your mail to verify your account and start
						investing real estate
					</p>
				</div>
			</div>
		</main>
	);
};
