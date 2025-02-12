import styles from "./styles.module.css";

export const SkeletonLoader = ({
	width = "100%",
	height = "1.5rem",
	borderRadius = " 1.25rem",
	count = 1,
}) => {
	const skeletonArray = Array(count).fill(0);

	return (
		<div>
			{skeletonArray.map((_, index) => (
				<div
					key={index}
					className={styles.container}
					style={{
						width: width,
						height: height,
						borderRadius: borderRadius,
					}}
				></div>
			))}
		</div>
	);
};
