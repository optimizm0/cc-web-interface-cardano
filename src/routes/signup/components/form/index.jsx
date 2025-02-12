import { useState } from "react";
import styles from "./styles.module.css";
import { Button, Input } from "../../../../components";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const checkValidity = () => {
		// Check if some fields in formData are empty
		const formDataEmpty = Object.values(formData).some(
			(value) => value === ""
		);

		// Check if all fields in errors are empty
		const errorsEmpty = Object.values(errors).every(
			(error) => error === ""
		);

		// Return true if both formData and errors are empty
		return formDataEmpty && errorsEmpty;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Validation
		let valid = true;
		const newErrors = { ...errors };

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
			valid = false;
		} else {
			newErrors.firstName = "";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
			valid = false;
		} else {
			newErrors.lastName = "";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Invalid email address";
			valid = false;
		} else {
			newErrors.email = "";
		}

		if (valid) {
			navigate("/verify-email");
			return;
		}

		setErrors(newErrors);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<Input
				type="text"
				placeholder="First name"
				name="firstName"
				value={formData.firstName}
				onChange={handleChange}
				errorText={errors.firstName}
				className={styles.input}
				required
			/>
			<Input
				type="text"
				placeholder="Last name"
				name="lastName"
				value={formData.lastName}
				onChange={handleChange}
				errorText={errors.lastName}
				className={styles.input}
				required
			/>
			<Input
				type="email"
				placeholder="Email address"
				name="email"
				value={formData.email}
				onChange={handleChange}
				errorText={errors.email}
				className={styles.input}
				required
			/>
			<Button disabled={checkValidity()} type="submit">
				Continue
			</Button>
		</form>
	);
};
