import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DiscordIcon, FacebookIcon, GoogleIcon } from "src/assets";
import { addUser, removeUser } from "src/redux/slices";
import { disconnectWallet, signMessage } from "src/utils";
import toast from "react-hot-toast";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { useLoginOnServerWithNufiMutation } from "src/redux/slices";
import { MESSAGE } from "src/constants";

export const SigninForm = () => {
	const [signInWalletDetails, setSignInWalletDetails] = useState(null);
	const [userData, setUserData] = useState(null);
	const [isLogining, setIsLogining] = useState(false);
	const [loginOnServerWithNufi, { isLoading }] =
		useLoginOnServerWithNufiMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const signIn = async () => {
		setIsLogining(true);
		const signMessageDetails = await signMessage();

		if (signMessageDetails) {
			setSignInWalletDetails(signMessageDetails);
		}
		setIsLogining(false);
	};

	nufiCoreSdk.onSocialLoginInfoChanged((data) => {
		if (data) {
			setUserData(data);
		} else {
			dispatch(removeUser());
			window.location.replace("/");
		}
	});

	useEffect(() => {
		if (signInWalletDetails && userData) {
			setIsLogining(true);
			loginOnServerWithNufi({
				email: userData?.email,
				message: MESSAGE,
				signatureHex: signInWalletDetails?.signatureHex,
				publicKeyHex: signInWalletDetails?.publicKeyHex,
			})
				.then((res) => {
					if (res?.data) {
						dispatch(
							addUser({
								...res?.data?.data,
								user: {
									...res?.data?.data?.user,
									wallet: signInWalletDetails?.formattedAddress,
									socialData: userData,
								},
							})
						);
						toast.success("Login succesful!");
						navigate("/dashboard");
					} else {
						disconnectWallet();
						toast.error("Something went wrong!");
					}
				})
				.catch(() => {
					disconnectWallet();
					toast.error("Something went wrong!");
				})
				.finally(() => {
					setUserData(null);
					setSignInWalletDetails(null);
					setIsLogining(false);
				});
		}
	}, [
		dispatch,
		loginOnServerWithNufi,
		navigate,
		signInWalletDetails,
		userData,
	]);

	return (
		<>
			{/* {loading ? <AppLoader /> : null} */}
			<div className={styles.form}>
				<Button
					disabled={isLoading || isLogining}
					onClick={signIn}
					className={styles.defaultSignInButton}
				>
					{isLoading || isLogining ? (
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
