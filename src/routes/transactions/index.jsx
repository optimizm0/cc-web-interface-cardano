import { useState } from "react";
import styles from "./style.module.css";
import {
	Pagination,
	Sidebar,
	SkeletonLoader,
	TransactionCard,
} from "../../components";
import { useGetTransactionsQuery } from "src/redux/slices";
import { emptyState } from "src/assets";

export const Transactions = () => {
	const [currentTab, setCurrentTab] = useState(0);
	const [page, setPage] = useState(1);
	const [showToolTip, setShowToolTip] = useState(false);

	const { data, isLoading } = useGetTransactionsQuery(page);

	const handlePageChange = (page) => {
		setPage(page);
	};

	console.log("====================================");
	console.log(data);
	console.log("====================================");

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>WALLET</h6>
					</header>
					<section className={styles.transactions}>
						<div>
							<h1 className={styles.headerText}>
								Transaction history ({data?.meta?.total || 0})
							</h1>
							<div className={styles.tabButtonsContainer}>
								<button
									onClick={() => setCurrentTab(0)}
									className={
										currentTab === 0 ? styles.active : ""
									}
								>
									All
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
						<div className={styles.transactionContents}>
							<div className={styles.cardContainer}>
								{isLoading &&
									[1, 2, 3, 4].map((number) => (
										<SkeletonLoader
											key={number}
											height="4rem"
										/>
									))}
								{data?.data?.length ? (
									data?.data?.map((item, index) => (
										<TransactionCard
											key={index}
											header={`Purchased ${item?.property?.name}`}
											description={`You just bought ${item?.fractions} units of ${item?.property?.name}`}
											{...item}
										/>
									))
								) : !isLoading ? (
									<div className={styles.noContent}>
										<img
											src={emptyState}
											alt="emptyState"
											placeholder="blur"
										/>
										<h2 className={styles.noContentHeader}>
											No transaction yet
										</h2>
										<h2
											className={
												styles.noContentParagraph
											}
										>
											You have not made any transaction
											yet
										</h2>
									</div>
								) : (
									""
								)}
							</div>
						</div>
						{data?.meta && (
							<Pagination
								totalItems={data?.meta?.total}
								itemsPerPage={data?.meta?.limit}
								currentPage={data?.meta?.page}
								onPageChange={handlePageChange}
							/>
						)}
					</section>
				</div>
				<Sidebar />
			</div>
		</main>
	);
};
