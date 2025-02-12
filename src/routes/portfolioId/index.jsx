import { useState } from "react";
import { Button, ConnectedWalletButton } from "../../components";
import { UsdcIcon, ArrowWithLine, PropertyIcon } from "../../assets";
import { useNavigate, useLocation } from "react-router-dom";
import { fromBigNumberToUSDC } from "src/utils";
import styles from "./style.module.css";

export const PortfolioId = () => {
	const [currentTab, setCurrentTab] = useState(0);
	const [currentImage, setCurrentImage] = useState(0);
	const [showMoreAbout, setShowMoreAbout] = useState(false);
	const [showMoreFeatures, setShowMoreFeatures] = useState(false);
	const [showToolTip, setShowToolTip] = useState(false);

	const navigate = useNavigate();

	const { state: data } = useLocation();

	const handleGalleryLeft = () => {
		if (currentImage === 0) {
			setCurrentImage(2);
			return;
		}
		setCurrentImage(currentImage - 1);
	};

	const handleGalleryRight = () => {
		if (currentImage === 2) {
			setCurrentImage(0);
			return;
		}
		setCurrentImage(currentImage + 1);
	};

	const handlePurchase = () => {
		navigate(`/investment/${data._id}`, { state: data });
	};

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>PORTFOLIO</h6>
						<ConnectedWalletButton
							className={styles.connectedWalletButton}
						/>
					</header>
					<section className={styles.propertyDetail}>
						<div>
							<button
								className={styles.backButton}
								onClick={() =>
									navigate("/portfolio", { replace: true })
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
													Owned
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
												Units owned
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												{data?.amountOwned}
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
												Price per unit
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												<UsdcIcon
													className={styles.usdcIcon}
												/>{" "}
												{fromBigNumberToUSDC(
													data?.pricePerFraction
												)}
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
												Total value owned
											</h6>
											<h3
												className={
													styles.figureBoxFigure
												}
											>
												<UsdcIcon
													className={styles.usdcIcon}
												/>{" "}
												{fromBigNumberToUSDC(
													data?.pricePerFraction
												) * data?.amountOwned}
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
									<div className={styles.actionButtons}>
										<Button onClick={handlePurchase}>
											Buy assets
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
											Units owned
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.amountOwned}
										</h3>
									</div>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Total units
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.totalSupply}
										</h3>
									</div>
								</div>
								<div className={styles.figureBox}>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Price per unit
										</h6>
										<h3 className={styles.figureBoxFigure}>
											<UsdcIcon
												className={styles.usdcIcon}
											/>{" "}
											{fromBigNumberToUSDC(
												data?.pricePerFraction
											)}
										</h3>
									</div>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Total value owned
										</h6>
										<h3 className={styles.figureBoxFigure}>
											<UsdcIcon
												className={styles.usdcIcon}
											/>{" "}
											{fromBigNumberToUSDC(
												data?.pricePerFraction
											) * data?.amountOwned}
										</h3>
									</div>
								</div>
								<div className={styles.figureBox}>
									<div className={styles.figureBoxContents}>
										<h6 className={styles.figureBoxHeader}>
											Expected yield
										</h6>
										<h3 className={styles.figureBoxFigure}>
											{data?.expectedYield}
										</h3>
									</div>
								</div>
								<div className={styles.actionButtons}>
									<Button onClick={handlePurchase}>
										Buy assets
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
