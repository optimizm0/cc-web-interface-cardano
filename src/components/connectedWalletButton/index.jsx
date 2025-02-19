import { useState } from "react";
import styles from "./styles.module.css";
import { Arrow, PowerIcon, avatar } from "../../assets";
import { formatCryptoAddress, magicInstance } from "src/utils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "src/redux/slices";
import toast from "react-hot-toast";
// import nufiCoreSdk from "@nufi/dapp-client-core";

export const ConnectedWalletButton = ({ className = {} }) => {
	const [showDisconnectButton] = useState(false);
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const disconnectWallet = async () => {
		setLoading(true);
		await magicInstance.user
			.logout()
			.then(() => {
				dispatch(removeUser());
				window.location.replace("/");
			})
			.catch(() => toast.error("Something went wrong!!"))
			.finally(() => setLoading(false));
	};

	const getWalletInfo = async () => {
		await magicInstance.wallet
			.getInfo()
			.then((data) => setAddress(data?.publicAddress))
			.catch((err) => console.log(err, "error"));
	};

	const api = async () => {
		// setLoading(true);
		// const widgetApi = await nufiCoreSdk.getWidgetApi();
		// widgetApi.showWidget("opened");
		// dispatch(removeUser());
		// widgetApi.signOut();
		// window.location.replace("/");
		await window.cardano.nufiSSO.enable();
		// setLoading(false);
	};

	useEffect(() => {
		getWalletInfo();
		api();
	}, []);

	return (
		<div className={`${styles.accountDetailsHolder} ${className}`}>
			<button className={styles.accountDetails} onClick={api}>
				<div>
					<img
						src={avatar}
						alt="avatar"
						style={{ width: 40, height: 40 }}
						loading="eager"
					/>
					<div>
						<h5 className={styles.header}>Wallet Address</h5>
						<p className={styles.address}>
							{!address
								? "Loading..."
								: formatCryptoAddress(address)}
						</p>
					</div>
				</div>
				<Arrow className={styles.arrow} />
			</button>
			<button
				className={`${styles.disconnectButton} ${
					showDisconnectButton ? styles.showDisconnectButton : ""
				}`}
				disabled={loading}
				onClick={disconnectWallet}
			>
				{!loading ? (
					<>
						<PowerIcon />
						<span>Disconnect wallet</span>
					</>
				) : (
					"..."
				)}
			</button>
		</div>
	);
};
