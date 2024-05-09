import styles from "./Home.module.css";

const Home = () => {
	return (
		<section className={styles.home}>
			<h1 className={styles.heading}>Task Manager</h1>
			<a href="/login" className={styles.link}>
				Click here to Login.
			</a>
		</section>
	);
};

export default Home;
