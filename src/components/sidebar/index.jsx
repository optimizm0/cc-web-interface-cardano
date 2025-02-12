import styles from "./styles.module.css";
import { Close, TransactionIcon } from "../../assets";
import { Button } from "../button";
import { ConnectedWalletButton } from "../connectedWalletButton";
import { fromBigNumberToUSDC, magicInstance } from "src/utils";
import { useGetUserQuery } from "src/redux/slices";
import { SkeletonLoader } from "../skeletonLoader";
import { useState } from "react";
import toast from "react-hot-toast";

export const Sidebar = ({ showSmallSideBar = false, setShowSmallSideBar }) => {
	const [isLoadingMagic, setIsLoadingMagic] = useState(false);
	const { data, isLoading, isFetching } = useGetUserQuery("", {
		refetchOnFocus: true,
	});

	const buyUSDC = async () => {
		try {
			setIsLoadingMagic(true);
			await magicInstance.wallet.showUI();
		} catch {
			toast.error("Something went wrong!");
		} finally {
			setIsLoadingMagic(false);
		}
	};

	return (
		<>
			<section className={`${styles.sidebar} ${styles.sidebarLarge}`}>
				<h3 className={styles.sidebarHeader}>Account information</h3>
				<ConnectedWalletButton
					className={styles.connectedWalletButton}
				/>
				<div className={styles.balanceHolder}>
					<h4 className={styles.headerTitle}>Total USDC balance</h4>
					<div className={styles.balance}>
						{!isLoading || !isFetching ? (
							<h3 className={styles.headerBalance}>
								{fromBigNumberToUSDC(data?.data?.usdcBalance)}{" "}
								<span>USDC</span>
							</h3>
						) : (
							<SkeletonLoader />
						)}
					</div>
					<p className={styles.infoParagraph}>
						Don&apos;t have enough USDC? Get more by clicking on the
						button below
					</p>
					<Button
						onClick={buyUSDC}
						disabled={isLoading || isLoadingMagic || isFetching}
					>
						{isLoadingMagic ? "Loading..." : "Buy USDC"}
					</Button>
				</div>
				<div className={styles.balanceHolder}>
					<h4 className={styles.headerTitle}>Total asset value</h4>
					<div className={styles.balance}>
						{!isLoading || !isFetching ? (
							<h3 className={styles.headerBalance}>
								{fromBigNumberToUSDC(
									data?.data?.totalAssetBalance
								)}{" "}
								<span>USDC</span>
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
								{data?.data?.totalCoOwned}
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
							Total USDC balance
						</h4>
						<div className={styles.balance}>
							{!isLoading || !isFetching ? (
								<h3 className={styles.headerBalance}>
									{fromBigNumberToUSDC(
										data?.data?.usdcBalance
									)}
									<span>USDC</span>
								</h3>
							) : (
								<SkeletonLoader />
							)}
						</div>
						<div className={styles.transactionBalanceHolder}>
							<TransactionIcon />
							<h5 className={styles.headerBalanceSmall}>
								0.00 <span>$</span>
							</h5>
						</div>
						<p className={styles.infoParagraph}>
							Don&apos;t have enough USDC? Get more by clicking on
							the button below
						</p>
						<Button
							onClick={buyUSDC}
							disabled={isLoading || isLoadingMagic || isFetching}
						>
							{isLoadingMagic ? "Loading..." : "Buy USDC"}
						</Button>
					</div>
					<div className={styles.balanceHolder}>
						<h4 className={styles.headerTitle}>
							Total asset value
						</h4>
						<div className={styles.balance}>
							{!isLoading || !isFetching ? (
								<h3 className={styles.headerBalance}>
									{fromBigNumberToUSDC(
										data?.data?.totalAssetBalance
									)}
									<span>USDC</span>
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
								<h3 className={styles.headerBalance}>0</h3>
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
