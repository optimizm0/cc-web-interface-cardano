import { useEffect } from "react";
import styles from "./styles.module.css";
import { Button } from "../../../../components";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
import { DiscordIcon, FacebookIcon, GoogleIcon } from "src/assets";
import { addUser } from "src/redux/slices";
import { signMessage } from "src/utils";
import toast from "react-hot-toast";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const isLoading = false;

export const SigninForm = () => {
	// const [publicKeyHex, setPublicKeyHex] = useState(null);
	// const [signatureHex, setSignatureHex] = useState(null);
	// const [loginOnServerWithNufi, { isLoading }] =
	// 	useLoginOnServerWithNufiMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const signIn = async () => {
		// const signedMessage = await signMessage("Hello, Welcome to Chaincrib!");
		// console.log(signedMessage, "signedMessage");
		await signMessage();

		// if (signedData) {
		// 	setPublicKeyHex(signedData?.key);
		// 	setSignatureHex(signedData?.signature);
		// 	return;
		// }
	};

	useEffect(() => {
		nufiCoreSdk.onSocialLoginInfoChanged((data) => {
			if (data) {
				dispatch(addUser(data));
				toast.success("Login succesful!");
				navigate("/dashboard");
			}
			// Store data in your app
			// if (publicKeyHex && signatureHex) {
			// 	loginOnServerWithNufi({
			// 		email: "eobumma@gmail.com",
			// 		message: MESSAGE,
			// 		publicKeyHex,
			// 		signatureHex,
			// 	})
			// 		.then((res) => {
			// 			console.log(res, "result");
			// 		})
			// 		.catch((error) => {
			// 			console.log(error, "Something went wrong!");
			// 		});
			// }
		});
	}, [dispatch, navigate]);

	return (
		<>
			{/* {loading ? <AppLoader /> : null} */}
			<div className={styles.form}>
				<Button
					disabled={isLoading}
					onClick={signIn}
					className={styles.defaultSignInButton}
				>
					{isLoading ? (
						"Loading..."
					) : (
						<div className={styles.socialProvidersContainer}>
							Continue with <GoogleIcon /> <FacebookIcon />{" "}
							<DiscordIcon />
						</div>
					)}
				</Button>
			</div>
		</>
	);
};
