import styles from "./style.module.css";
import {
	ConnectedWalletButton,
	Pagination,
	ProductCard,
	SkeletonLoader,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { useGetCribsQuery } from "src/redux/slices";
import { useState } from "react";

export const Investment = () => {
	const [page, setPage] = useState(1);
	const navigate = useNavigate();
	const { data, isFetching, isLoading } = useGetCribsQuery(page);

	const handlePageChange = (page) => {
		setPage(page);
	};

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>Investment</h6>
						<ConnectedWalletButton
							className={styles.connectedWalletButton}
						/>
					</header>
					<section className={styles.portfolio}>
						<div className={styles.headerContainer}>
							<h1 className={styles.headerText}>
								All Assets ({data?.meta?.total || 0})
							</h1>
						</div>
						<div className={styles.portfolioContents}>
							{isFetching && !isLoading && (
								<SkeletonLoader height="18rem" />
							)}
							{isLoading ? (
								[0, 0, 0].map((_, index) => (
									<SkeletonLoader
										key={index}
										height="18rem"
									/>
									// eslint-disable-next-line no-mixed-spaces-and-tabs
								))
							) : data?.data?.length ? (
								data?.data.map((item, index) => (
									<ProductCard
										key={item?._id || index}
										{...item}
										onClick={() =>
											navigate(
												`/investment/${item._id}`,
												{ state: item }
											)
										}
									/>
								))
							) : (
								<div className={styles.noContent}>
									<h3 className={styles.noContentHeader}>
										No properties yet.
									</h3>
									<p className={styles.noContentParagraph}>
										There are no properties to display now.
									</p>
								</div>
							)}
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
			</div>
		</main>
	);
};
