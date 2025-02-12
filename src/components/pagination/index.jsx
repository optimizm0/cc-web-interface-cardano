import styles from "./styles.module.css";

export const Pagination = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
	const maxPageButtons = 5; // Maximum number of page buttons to display at a time

	// Handle going to a specific page
	const goToPage = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			onPageChange(pageNumber); // Trigger page change in parent component
		}
	};

	// Generate the page numbers to display
	const renderPageNumbers = () => {
		const pageNumbers = [];

		// Determine the start and end of the range of page numbers to show
		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxPageButtons / 2)
		);
		let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

		// Adjust if we are near the beginning or end
		if (endPage - startPage + 1 < maxPageButtons) {
			startPage = Math.max(1, endPage - maxPageButtons + 1);
		}

		// Loop over the calculated range of pages
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => goToPage(i)}
					style={{
						fontWeight: currentPage === i ? "bold" : "normal",
					}} // Highlight current page
				>
					{i}
				</button>
			);
		}

		return pageNumbers;
	};

	return (
		<div className={styles.container}>
			<button onClick={() => goToPage(1)} disabled={currentPage === 1}>
				First
			</button>
			<button
				onClick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</button>

			{/* Render the page numbers */}
			{renderPageNumbers()}

			<button
				onClick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
			<button
				onClick={() => goToPage(totalPages)}
				disabled={currentPage === totalPages}
			>
				Last
			</button>
		</div>
	);
};

export default Pagination;
