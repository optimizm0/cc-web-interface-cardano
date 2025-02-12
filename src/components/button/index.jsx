import styles from "./styles.module.css";

export const Button = ({ children, className, ...rest }) => {
	return (
		<button className={`${styles.button}  ${className}`} {...rest}>
			{children}
		</button>
	);
};
