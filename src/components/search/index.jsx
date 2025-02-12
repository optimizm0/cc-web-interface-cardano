import styles from "./styles.module.css";
import { SearchIcon } from "../../assets";

export const Search = () => {
	return (
		<div className={styles.container}>
			<SearchIcon />
			<input type="text" placeholder="Search for propery" />
		</div>
	);
};
