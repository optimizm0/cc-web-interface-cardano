import React from "react";
import styles from "./styles.module.css";

export const Input = ({ className, errorText, ...rest }) => {
	return (
		<div className={className}>
			<input
				autoComplete="none"
				aria-autocomplete="none"
				className={`${styles.input} ${
					errorText ? styles.inputError : ""
				}`}
				{...rest}
			/>
			<span className={styles.errorText}>{errorText}</span>
		</div>
	);
};
