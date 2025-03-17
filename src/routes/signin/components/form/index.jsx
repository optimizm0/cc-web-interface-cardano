import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DiscordIcon, FacebookIcon, GoogleIcon } from "src/assets";
import { addUser, removeUser } from "src/redux/slices";
import { signMessage } from "src/utils";
import toast from "react-hot-toast";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { useLoginOnServerWithNufiMutation } from "src/redux/slices";

export const SigninForm = () => {
	const [publicKeyHex, setPublicKeyHex] = useState(null);
	const [userData, setUserData] = useState(null);
	const [isLogining, setIsLogining] = useState(false);
	const [loginOnServerWithNufi, { isLoading }] =
		useLoginOnServerWithNufiMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const signIn = async () => {
		setIsLogining(true);
		const address = await signMessage();

		if (address) {
			setPublicKeyHex(address);
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
		if (publicKeyHex && userData) {
			setIsLogining(true);
			loginOnServerWithNufi({
				email: userData?.email,
				publicKeyHex,
			})
				.then((res) => {
					if (res?.data) {
						console.log(
							{
								...res?.data?.data,
								user: {
									...res?.data?.data?.user,
									wallet: publicKeyHex,
								},
							},
							"stored valuex"
						);
						dispatch(
							addUser({
								...res?.data?.data,
								user: {
									...res?.data?.data?.user,
									wallet: publicKeyHex,
								},
							})
						);
						toast.success("Login succesful!");
						navigate("/dashboard");
					} else {
						toast.error("Something went wrong!");
					}
				})
				.catch(() => {
					toast.error("Something went wrong!");
				})
				.finally(() => {
					setUserData(null);
					setPublicKeyHex(null);
					setIsLogining(false);
				});
		}
	}, [dispatch, loginOnServerWithNufi, navigate, publicKeyHex, userData]);

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
