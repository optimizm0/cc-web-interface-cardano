import { useState } from "react";
import styles from "./styles.module.css";
import { Arrow, PowerIcon, avatar } from "../../assets";
import { formatCryptoAddress, showWidget } from "src/utils";
import { useEffect } from "react";
import nufiCoreSdk from "@nufi/dapp-client-core";
import { useSelector } from "react-redux";

export const ConnectedWalletButton = ({ className = {} }) => {
	const [showDisconnectButton] = useState(false);
	const address = useSelector((state) => state?.user?.value?.user?.wallet);
	const [loading, setLoading] = useState(false);


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
