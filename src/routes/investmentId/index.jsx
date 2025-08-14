import { useState } from "react";
import { Button, ConnectedWalletButton } from "../../components";
import { AdaIcon, ArrowWithLine, PropertyIcon } from "../../assets";
import { useNavigate, useLocation } from "react-router-dom";
import { signTransaction } from "src/utils";
import { chainCribApi, useCribPurchaseMutation } from "src/redux/slices";
import styles from "./style.module.css";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import nufiCoreSdk from "@nufi/dapp-client-core";

export const InvestmentId = () => {
	const address = useSelector((state) => state?.user?.value?.user?.wallet);
	const [currentTab, setCurrentTab] = useState(0);
	const [currentImage, setCurrentImage] = useState(0);
	const [showMoreAbout, setShowMoreAbout] = useState(false);
	const [showMoreFeatures, setShowMoreFeatures] = useState(false);
	const [showToolTip, setShowToolTip] = useState(false);
	const [fractions, setFractions] = useState(1);
	const [isLoadingNufi, setIsLoadingNufi] = useState(false);

	const navigate = useNavigate();
	const [cribPurchase, { isLoading }] = useCribPurchaseMutation();

	const { state: data } = useLocation();

	const dispatch = useDispatch();

	const handleGalleryLeft = () => {
		if (currentImage === 0) {
			setCurrentImage(data?.altImages?.length - 1 || 0);
			return;
		}
		setCurrentImage(currentImage - 1);
	};

	const handleGalleryRight = () => {
		if (currentImage === data?.altImages?.length - 1) {
			setCurrentImage(0);
			return;
		}
		setCurrentImage(currentImage + 1);
	};

	const handleChangeFraction = (e) => {
		const { value } = e.target;
		setFractions(value);
	};

	const handleFractionButtonPress = (e) => {
		const { innerText } = e.target;
		if (innerText === "+") {
			setFractions((value) => Number(value) + 1);
		} else {
			setFractions((value) => Number(value) - 1);
		}
	};

	const handlePurchaseNew = async () => {
		setIsLoadingNufi(true);
		const widgetApi = await nufiCoreSdk.getWidgetApi();
		try {
			if (fractions < 1 || fractions > data?.totalAvailable) {
				toast.error("Invalid fraction value!");
				return;
			}
			const price = fractions * data?.pricePerFraction;
			const signedTx = await signTransaction(price);
			if (signedTx) {
				cribPurchase({
					propertyId: data?._id,
					recieverAddress: address,
					fractionsToBuy: fractions,
					signedTx: signedTx,
				})
					.then((result) => {
						if (result?.error) {
							toast.error(
								result?.error?.data?.message ||
									"Couldn't make the purchase, try again!"
							);
							return;
						}
						dispatch(
							chainCribApi.util.invalidateTags(["Cribs", "User"])
						);
						toast.success("Purchase successful!");
						navigate("/portfolio");
						return;
					})
					.catch(() => {
						toast.error("Couldn't make the purchase, try again!");
					});
			} else {
				toast.error("Couldn't make the purchase, try again!");
			}
		} catch (error) {
			if (typeof error === 'string') {
				toast.error(error);
			} else {
				toast.error("Couldn't make the purchase, try again!");
			}
		} finally {
			widgetApi.showWidget("closed");
			setIsLoadingNufi(false);
		}
	};

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>INVESTMENT</h6>
						<ConnectedWalletButton
							className={styles.connectedWalletButton}
						/>
					</header>
					<section className={styles.propertyDetail}>
						<div>
							<button
								className={styles.backButton}
								onClick={() =>
									navigate("/investment", { replace: true })
								}
							>
								<h1 className={styles.headerText}>
									<ArrowWithLine className={styles.arrow} />
									Go Back
								</h1>
							</button>
							<div className={styles.tabButtonsContainer}>
								<button
									onClick={() => setCurrentTab(0)}
									className={
										currentTab === 0 ? styles.active : ""
									}
								>
									Description
								</button>
								<button
									// onClick={() => setCurrentTab(1)}
									className={
										currentTab === 1 ? styles.active : ""
									}
									onMouseEnter={() => setShowToolTip(true)}
									onMouseLeave={() => setShowToolTip(false)}
								>
									Revenue
								</button>
								{showToolTip ? (
									<div className={styles.toolTip}>
										This feature is coming soon!!
									</div>
								) : (
									""
								)}
							</div>
						</div>
						<div className={styles.propertyDetailContents}>
							<div className={styles.gridItemOne}>
								<div className={styles.gallery}>
									{data?.altImages?.map((image, index) => (
										<img
											key={index}
											src={image}
											alt={`demo-image-${index}`}
											className={`${
												styles.currentImage
											} ${
												currentImage === index
													? styles.active
													: ""
											}`}
										/>
									))}
									<div className={styles.galleryControls}>
										<div className={styles.galleryButtons}>
											<button onClick={handleGalleryLeft}>
												<ArrowWithLine />
											</button>
											<button
												onClick={handleGalleryRight}
											>
												<ArrowWithLine />
											</button>
										</div>
										{data?.altImages?.length ? (
											<div
												className={
													styles.galleryThumbnails
												}
											>
												{data?.altImages?.map(
													(image, index) => (
														<button
															className={
																styles.thumnnail
															}
															key={index}
														>
															<img
																src={image}
																alt={`image-${index}`}
																onClick={() =>
																	setCurrentImage(
																		index
																	)
																}
															/>
														</button>
													)
												)}
											</div>
										) : (
											""
										)}
									</div>
								</div>
								<div className={styles.details}>
									<div className={styles.detailsContent}>
										<div>
											<div
												className={
													styles.propertyNameAndStatus
												}
											>
												<h1
													className={
														styles.propertyName
													}
												>
													{data.name}
												</h1>
												<span className={styles.status}>
													Available
												</span>
											</div>
											<a
												className={styles.address}
												href={data.address.url}
												target="_blank"
											>
												{data.address.name}
											</a>
										</div>
										<div className={styles.properyType}>
											<p>
												<PropertyIcon />
												Property type -{" "}
												<span>Co-owned</span>
											</p>
										</div>
									</div>
								</div>
								<div
									className={`${styles.gridItemTwo} ${styles.gridSmallItemTwo}`}
								>
									<div className={styles.figureBox}>
										<div
											className={styles.figureBoxContents}
										>
											<h6
												className={
													styles.figureBoxHeader
												}
											>
												Price per unit
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												<AdaIcon
													className={styles.adaIcon}
													style={{
														marginRight: ".8rem",
													}}
												/>
												{data?.pricePerFraction}
											</h3>
										</div>
										<div
											className={styles.figureBoxContents}
										>
											<h6
												className={
													styles.figureBoxHeader
												}
											>
												Amount sold
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												{data?.totalSupply -
													data?.totalAvailable}
											</h3>
										</div>
									</div>
									<div className={styles.figureBox}>
										<div
											className={styles.figureBoxContents}
										>
											<h6
												className={
													styles.figureBoxHeader
												}
											>
												Total units
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												{data?.totalSupply}
											</h3>
										</div>
										<div
											className={styles.figureBoxContents}
										>
											<h6
												className={
													styles.figureBoxHeader
												}
											>
												Expected yield
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												{data?.expectedYield}
											</h3>
										</div>
									</div>
									<div className={styles.figureBox}>
										<div
											className={`${styles.figureBoxContents} ${styles.figureBoxContentForFractions}`}
										>
											<h6
												className={
													styles.figureBoxHeader
												}
											>
												No. of units to buy
											</h6>
											<div
												className={
													styles.fractionsInput
												}
											>
												<button
													type="button"
													onClick={
														handleFractionButtonPress
													}
													disabled={fractions <= 1}
												>
													-
												</button>
												<input
													type="number"
													name="fractions"
													value={fractions}
													onChange={
														handleChangeFraction
													}
													min={1}
													max={data?.totalAvailable}
												/>
												<button
													type="button"
													onClick={
														handleFractionButtonPress
													}
													disabled={
														fractions ===
														data?.totalAvailable
													}
												>
													+
												</button>
											</div>
											{	fractions ?	<p className={styles.fractionCost}>
											<span>{fractions} unit(s)</span> of this property will cost you <span>{fractions * data?.pricePerFraction} ADA</span>.
											</p> : ""}
										</div>
									</div>
									<div className={styles.actionButtons}>
										<Button
											onClick={handlePurchaseNew}
											disabled={
												!data?.totalAvailable ||
												isLoading ||
												isLoadingNufi
											}
											type="button"
										>
											{!data?.totalAvailable
												? "Sold out!!"
												: isLoading || isLoadingNufi
												? "Loading..."
												: "Buy assets"}
										</Button>
									</div>
									<p className={styles.infoText}>
										You can buy as many units as you can if
										it is still available for purchase.
									</p>
								</div>
								<div className={styles.moreDetails}>
									<div className={styles.moreDetailsHeader}>
										<h3
											className={
												styles.moreDetailsHeaderText
											}
										>
											About property
										</h3>
										<button
											className={
												styles.moreDetailsHeaderButton
											}
											onClick={() =>
												setShowMoreAbout(!showMoreAbout)
											}
										>
											{showMoreAbout
												? "Show less"
												: "Show more"}
										</button>
									</div>
									<div className={styles.moreDetailsContent}>
										<p
											className={
												showMoreAbout
													? styles.activeMoreDetails
													: ""
											}
										>
											{data?.description}
										</p>
									</div>
								</div>
								<div className={styles.moreDetails}>
									<div className={styles.moreDetailsHeader}>
										<h3
											className={
												styles.moreDetailsHeaderText
											}
										>
											Property features
										</h3>
										<button
											className={
												styles.moreDetailsHeaderButton
											}
											onClick={() =>
												setShowMoreFeatures(
													!showMoreFeatures
												)
											}
										>
											{showMoreFeatures
												? "Show less"
												: "Show more"}
										</button>
									</div>
									<div className={styles.moreDetailsContent}>
										<p
											className={
												showMoreFeatures
													? styles.activeMoreDetails
													: ""
											}
										>
											{data?.features}
										</p>
									</div>
								</div>
							</div>
							<div
								className={`${styles.gridItemTwo} ${styles.gridBigItemTwo}`}
							>
								<div className={styles.figureBox}>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Price per unit
										</h6>
										<h3 className={styles.figureBoxFigure}>
											<AdaIcon
												className={styles.adaIcon}
												style={{ marginRight: ".8rem" }}
											/>
											{data?.pricePerFraction}
										</h3>
									</div>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Amount sold
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.totalSupply -
												data?.totalAvailable}
										</h3>
									</div>
								</div>
								<div className={styles.figureBox}>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Total units
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.totalSupply}
										</h3>
									</div>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Expected yield
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.expectedYield}
										</h3>
									</div>
								</div>
								<div className={styles.figureBox}>
									<div
										className={`${styles.figureBoxContents} ${styles.figureBoxContentForFractions}`}
									>
										<h6 className={styles.figureBoxHeader}>
											No. of units to buy
										</h6>
										<div className={styles.fractionsInput}>
											<button
												type="button"
												onClick={
													handleFractionButtonPress
												}
												disabled={fractions <= 1}
											>
												-
											</button>
											<input
												type="number"
												name="fractions"
												value={fractions}
												onChange={handleChangeFraction}
												min={1}
												max={data?.totalAvailable}
											/>
											<button
												type="button"
												onClick={
													handleFractionButtonPress
												}
												disabled={
													fractions ===
													data?.totalAvailable
												}
											>
												+
											</button>
										</div>
										{	fractions ?	<p className={styles.fractionCost}>
											<span>{fractions} unit(s)</span> of this property will cost you <span>{fractions * data?.pricePerFraction} ADA</span>.
											</p> : ""}
									</div>
								</div>
								<div className={styles.actionButtons}>
									<Button
										onClick={handlePurchaseNew}
										disabled={
											!data?.totalAvailable ||
											isLoading ||
											isLoadingNufi
										}
										type="button"
									>
										{!data?.totalAvailable
											? "Sold out!!"
											: isLoading || isLoadingNufi
											? "Loading..."
											: "Buy assets"}
									</Button>
								</div>
								<p className={styles.infoText}>
									You can buy as many units as you can if it
									is still available for purchase.
								</p>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
};
