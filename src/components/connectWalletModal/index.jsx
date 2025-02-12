"use client";

import styles from "./styles.module.css";
import {
	Close,
	eternalImage,
	laceImage,
	namiImage,
	typhoonImage,
	vesprImage,
} from "../../assets";

const wallets = [
	{ name: "Nami Wallet", image: namiImage },
	{ name: "Eternl Wallet", image: eternalImage },
	{ name: "Vespr Wallet", image: vesprImage },
	{ name: "Lace Wallet", image: laceImage },
	{ name: "Typhoon Wallet", image: typhoonImage },
];

export const ConnectWalletModal = ({ closeModal, showModal }) => {
	return (
		<div className={`${styles.container} ${showModal ? styles.open : ""}`}>
			<div className={styles.content}>
				<button onClick={closeModal} className={styles.close}>
					<Close />
				</button>
				<section className={styles.modalDetails}>
					<h1>Connect Wallet</h1>
					<p>
						By connecting your wallet, you agree to the{" "}
						<a href="#">Terms & Conditions</a> and{" "}
						<a href="#" className="">
							Privacy Policy
						</a>
					</p>
					<div className={styles.walletsContainer}>
						{wallets.map(({ name, image }) => (
							<button key={name} className={styles.wallet}>
								<img
									src={image}
									style={{ width: 40, height: 40 }}
									alt={name}
								/>
								<div>
									<h2>{name}</h2>
									<p>
										Connect to your Nami wallet on your
										browser extension
									</p>
								</div>
							</button>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};
