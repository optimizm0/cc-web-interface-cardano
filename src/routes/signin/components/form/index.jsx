import { useState } from "react";
import styles from "./styles.module.css";
import { AppLoader, Button, Input } from "../../../../components";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser, useLoginOnServerMutation } from "src/redux/slices";
import { loginWithMagic } from "src/utils";
import { useDispatch } from "react-redux";

export const SigninForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
	});

	const [errors, setErrors] = useState({
		email: "",
	});

	const [loginOnServer, { isLoading }] = useLoginOnServerMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Validation
		let valid = true;
		const newErrors = { ...errors };

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
			setLoading(true);
			try {
				await loginWithMagic(formData.email, true).then((data) => {
					if (data) {
						loginOnServer(data)
							.then((res) => {
								dispatch(addUser(res?.data?.data));
								toast.success("Login succesful!");
								navigate("/dashboard");
							})
							.catch(() => {
								toast.error("Something went wrong!");
							});
					}
				});
			} catch {
				toast.error("Something went wrong!! 🥹");
			}
			setLoading(false);
		}

		setErrors(newErrors);
	};

	return (
		<>
			{loading ? <AppLoader /> : null}
			<form onSubmit={handleSubmit} className={styles.form}>
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
				<Button
					disabled={checkValidity() || isLoading}
					type="submit"
					className={styles.defaultSignInButton}
				>
					{isLoading ? "Loading..." : "Continue With Email"}
				</Button>
			</form>
		</>
	);
};
