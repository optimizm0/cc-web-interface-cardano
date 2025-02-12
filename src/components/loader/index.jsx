import styles from "./styles.module.css";

export const AppLoader = () => {
	return (
		<div className={styles.loaderContainer}>
			<div className={styles.loader}></div>
		</div>
	);
};
