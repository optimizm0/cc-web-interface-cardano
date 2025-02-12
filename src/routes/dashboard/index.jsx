import { useRef, useState } from "react";
import styles from "./style.module.css";
import { ProductCard, Sidebar, SkeletonLoader } from "../../components";
import { ArrowWithLine } from "../../assets";
import { useGetCribsQuery, useGetUserCribsQuery } from "src/redux/slices";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
	const [scrollPosition, setScrollPosition] = useState(0);

	const containerRef = useRef(null);
	const { data, isFetching, isLoading } = useGetCribsQuery();
	const {
		data: userCribs,
		isFetching: isFetchingUserCribs,
		isLoading: isLoadingUserCribs,
	} = useGetUserCribsQuery({ page: 1, limit: 2 });
	const navigate = useNavigate();

	const handleScroll = () => {
		const scrollLeft = containerRef.current.scrollLeft;
		setScrollPosition(scrollLeft);
	};

	const scrollLeft = () => {
		containerRef.current.scrollBy({
			left: -200, // adjust as needed
			behavior: "smooth",
		});
	};

	const scrollRight = () => {
		containerRef.current.scrollBy({
			left: 200, // adjust as needed
			behavior: "smooth",
		});
	};

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>Dashboard</h6>
						{/* <Search /> */}
					</header>
					<section className={styles.portfolio}>
						<div className={styles.headerContainer}>
							<h1 className={styles.headerText}>My Portfolio</h1>
							{userCribs?.data?.length ? (
								<button
									className={styles.headerContainerButton}
									onClick={() => navigate("/portfolio")}
								>
									See all
								</button>
							) : (
								""
							)}
						</div>
						{isLoadingUserCribs || isFetchingUserCribs ? (
							<div style={{ width: "90%", margin: "3rem auto" }}>
								<SkeletonLoader height="18rem" />
							</div>
						) : (
							<div className={styles.portfolioContents}>
								{userCribs?.data?.length ? (
									userCribs?.data?.map((item, index) => (
										<ProductCard
											className={styles.productCard}
											key={item?._id || index}
											{...item}
											onClick={() =>
												navigate(
													`/portfolio/${item._id}`,
													{
														state: item,
													}
												)
											}
										/>
									))
								) : (
									<div className={styles.noContent}>
										<h3 className={styles.noContentHeader}>
											No asset yet
										</h3>
										<p
											className={
												styles.noContentParagraph
											}
										>
											You have not purchased any asset yet
										</p>
									</div>
								)}
							</div>
						)}
					</section>
					<section className={styles.properties}>
						<div className={styles.headerContainer}>
							<h1 className={styles.headerText}>
								Available properties
							</h1>
							{data?.data.length ? (
								<button
									className={styles.headerContainerButton}
									onClick={() => navigate("/investment")}
								>
									See all
								</button>
							) : (
								""
							)}
						</div>
						{isLoading || isFetching ? (
							<div style={{ width: "90%", margin: "3rem auto" }}>
								<SkeletonLoader height="18rem" />
							</div>
						) : (
							<div
								className={styles.availablePropertiesContent}
								ref={containerRef}
								onScroll={handleScroll}
							>
								{data?.data?.length ? (
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
										<p
											className={
												styles.noContentParagraph
											}
										>
											There are no properties to display
											now.
										</p>
									</div>
								)}
							</div>
						)}
						<div className={styles.sliderButtonsContainer}>
							<button
								className={styles.sliderButton}
								disabled={scrollPosition <= 0}
								onClick={scrollLeft}
							>
								<ArrowWithLine />
							</button>
							<button
								className={styles.sliderButton}
								disabled={
									scrollPosition >=
									containerRef?.current?.scrollWidth -
										containerRef?.current?.clientWidth
								}
								onClick={scrollRight}
							>
								<ArrowWithLine />
							</button>
						</div>
					</section>
				</div>
				<Sidebar />
			</div>
		</main>
	);
};
