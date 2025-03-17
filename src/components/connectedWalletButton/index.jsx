import { useState } from "react";
import styles from "./styles.module.css";
import { Arrow, PowerIcon, avatar } from "../../assets";
import { formatCryptoAddress } from "src/utils";
import { useEffect } from "react";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { useSelector } from "react-redux";

export const ConnectedWalletButton = ({ className = {} }) => {
	const [showDisconnectButton] = useState(false);
	const address = useSelector((state) => state?.user?.value?.user?.wallet);
	const [loading, setLoading] = useState(false);

	const api = async () => {
		setLoading(true);
		await window.cardano.nufiSSO.enable();
		setLoading(false);
	};

	const showWidget = async () => {
		const widgetApi = await nufiCoreSdk.getWidgetApi();
		const status = widgetApi.getWidgetVisibilityStatus();

		if (status === "closed") {
			widgetApi.showWidget("opened");
		} else {
			widgetApi.showWidget("closed");
		}
	};

	useEffect(() => {
		api();
	}, []);

	return (
		<div className={`${styles.accountDetailsHolder} ${className}`}>
			<button className={styles.accountDetails} onClick={showWidget}>
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
				onClick={() => null}
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
