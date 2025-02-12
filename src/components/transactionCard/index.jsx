import styles from "./style.module.css";
import { roundedBill, roundedCoin } from "../../assets";
import { formatDate, fromBigNumberToUSDC } from "src/utils";

export const TransactionCard = ({
	revenue = false,
	header,
	description,
	createdAt,
	amountInUSDC,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.mainDetails}>
				<img
					src={revenue ? roundedCoin : roundedBill}
					alt="transaction-img"
					style={{ width: 40, height: 40 }}
					loading="eager"
				/>
				<div>
					<h1 className={styles.header}>{header}</h1>
					<p className={styles.description}>{description}</p>
				</div>
			</div>
			<div>
				<h2
					className={`${styles.amount} ${
						!revenue ? styles.expense : ""
					}`}
				>
					{fromBigNumberToUSDC(amountInUSDC)}
				</h2>
				<h3 className={styles.date}>{formatDate(createdAt)}</h3>
			</div>
		</div>
	);
};
