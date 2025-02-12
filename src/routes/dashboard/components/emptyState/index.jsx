import { useState } from "react";
import { Button, ConnectWalletModal } from "../../../../components";
import styles from "../../style.module.css";
import { vault } from "../../../../assets";

export const DashboardEmptyState = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<section className={styles.connectWallet}>
				<div>
					<img
						alt="vault.png"
						src={vault}
						loading="eager"
						style={{ width: 140, height: 140 }}
					/>
					<h1>Connect Wallet</h1>
					<p>
						Connect your Cardano wallet to view your Chaincrib
						dashboard and assets
					</p>
					<Button onClick={() => setShowModal(true)}>
						Connect Wallet
					</Button>
				</div>
			</section>
			<ConnectWalletModal
				closeModal={() => setShowModal(false)}
				showModal={showModal}
			/>
		</>
	);
};
