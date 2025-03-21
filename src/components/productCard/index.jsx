import styles from "./styles.module.css";
import { AdaIcon } from "../../assets";
import { addEllipsis } from "src/utils";

export const ProductCard = ({
	image,
	name,
	address,
	expectedYield,
	expectedYieldPeriod,
	pricePerFraction,
	totalSupply,
	className,
	amountOwned,
	totalAvailable,
	fullWidth = false,
	onClick = () => null,
}) => {
	return (
		<div
			className={`${styles.container} ${className}`}
			onClick={onClick}
			role="button"
			style={{ width: fullWidth ? "100%" : "auto" }}
		>
			<div className={styles.imageContainer}>
				<img src={image} alt={name} loading="eager" />
			</div>
			<div className={styles.details}>
				<div>
					<h2 className={styles.name}>
						{addEllipsis(name || "", 25)}
					</h2>
					<h3 className={styles.address}>
						{addEllipsis(address?.name || "", 45)}
					</h3>
					<p className={styles.exYield}>
						Expected yield -{" "}
						<span>
							{expectedYield} {expectedYieldPeriod}
						</span>
					</p>
				</div>
				<div>
					<h4 className={styles.unitValueHeader}>Unit value</h4>
					<div className={styles.unitValueContainer}>
						<AdaIcon />
						<h1 className={styles.unitValue}>{pricePerFraction}</h1>
					</div>
				</div>
			</div>
			<div className={styles.moreDetails}>
				{amountOwned ? (
					<h5>
						Units Owned <span>{amountOwned} units</span>
					</h5>
				) : (
					""
				)}
				{totalAvailable && !amountOwned ? (
					<h5>
						Amount sold{" "}
						<span>{totalSupply - totalAvailable} units</span>
					</h5>
				) : (
					""
				)}
				<h5>
					Total Units <span>{totalSupply} units</span>
				</h5>
			</div>
		</div>
	);
};
