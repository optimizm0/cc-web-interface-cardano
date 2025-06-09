import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Close } from "../../assets";
import { Button } from "../button";
import { ConnectedWalletButton } from "../connectedWalletButton";
import { useGetUserQuery } from "src/redux/slices";
import { SkeletonLoader } from "../skeletonLoader";
import toast from "react-hot-toast";
import { getNuFiAdaBalance } from "src/utils";

export const Sidebar = ({ showSmallSideBar = false, setShowSmallSideBar }) => {
	const [walletBalance, setWalletBalance] = useState(null);
	const [loadingWalletBalance, setLoadingWalletBalance] = useState(true);
	const { data, isLoading, isFetching } = useGetUserQuery("", {
		refetchOnFocus: true,
	});

	const buyUSDC = async () => {
		toast.success(
			"Click on NuFi Connect widet at the bottom left to buy ADA!",
			{}
		);
	};

	useEffect(() => {
			getNuFiAdaBalance()
			.then((balance) => {
				if (balance !== null) {
					setWalletBalance(balance.toFixed(3));
				}
			})
			.finally(() => setLoadingWalletBalance(false));
	}, [])



	return (
		<>
			<section className={`${styles.sidebar} ${styles.sidebarLarge}`}>
				<h3 className={styles.sidebarHeader}>Account information</h3>
				<ConnectedWalletButton
					className={styles.connectedWalletButton}
				/>
				<div className={styles.balanceHolder}>
					<h4 className={styles.headerTitle}>Total ADA balance</h4>
					<div className={styles.balance}>
						{!loadingWalletBalance ? (
							<h3 className={styles.headerBalance}>
								{walletBalance} <span>ADA</span>
							</h3>
						) : (
							<SkeletonLoader />
						)}
					</div>
					<p className={styles.infoParagraph}>
						Don&apos;t have enough ADA? Get more by clicking on the
						button below
					</p>
					<Button onClick={buyUSDC}>Buy ADA</Button>
				</div>
				<div className={styles.balanceHolder}>
					<h4 className={styles.headerTitle}>Total asset value</h4>
					<div className={styles.balance}>
						{!isLoading || !isFetching ? (
							<h3 className={styles.headerBalance}>
								{data?.data?.totalAssetBalance || "0"}{" "}
								<span>ADA</span>
							</h3>
						) : (
							<SkeletonLoader />
						)}
					</div>
				</div>
				<div className={styles.balanceHolder}>
					<h4 className={styles.headerTitle}>Total co-owned asset</h4>
					<div className={styles.balance}>
						{!isLoading || !isFetching ? (
							<h3 className={styles.headerBalance}>
								{data?.data?.totalCoOwned || "0"}{" "}
							</h3>
						) : (
							<SkeletonLoader />
						)}
					</div>
				</div>
			</section>
			<section
				className={`${styles.sidebarSmall} ${
					showSmallSideBar ? styles.sidebarSmallActive : ""
				}`}
			>
				<button
					className={styles.close}
					onClick={() => setShowSmallSideBar(false)}
				>
					<Close />
				</button>
				<div className={styles.sidebar}>
					<h3 className={styles.sidebarHeader}>
						Account information
					</h3>
					<ConnectedWalletButton
						className={styles.connectedWalletButton}
					/>
					<div className={styles.balanceHolder}>
						<h4 className={styles.headerTitle}>
							Total ADA balance
						</h4>
						<div className={styles.balance}>
							{!loadingWalletBalance ? (
								<h3 className={styles.headerBalance}>
									{walletBalance}
									<span>ADA</span>
								</h3>
							) : (
								<SkeletonLoader />
							)}
						</div>
						<p className={styles.infoParagraph}>
							Don&apos;t have enough ADA? Get more by clicking on
							the button below
						</p>
						<Button onClick={buyUSDC}>Buy ADA</Button>
					</div>
					<div className={styles.balanceHolder}>
						<h4 className={styles.headerTitle}>
							Total asset value
						</h4>
						<div className={styles.balance}>
							{!isLoading || !isFetching ? (
								<h3 className={styles.headerBalance}>
									{data?.data?.totalAssetBalance || "0"}
									<span>ADA</span>
								</h3>
							) : (
								<SkeletonLoader />
							)}
						</div>
					</div>
					<div className={styles.balanceHolder}>
						<h4 className={styles.headerTitle}>
							Total co-owned asset
						</h4>
						<div className={styles.balance}>
							{!isLoading || !isFetching ? (
								<h3 className={styles.headerBalance}>
									{data?.data?.totalCoOwned || "0"}{" "}
								</h3>
							) : (
								<SkeletonLoader />
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
