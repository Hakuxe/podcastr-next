import styles from './styles.module.scss';

export default function Header() {

	const currentDate = new Date().toLocaleDateString("pt-BR", 
		{ weekday: 'short', day: 'numeric', month: 'long',  }
	);
	
	return (
		<header className={styles.headerContainer}>
			<img src="/logo.svg" alt="Podcastr" />

			<p>O melhor para você ouvir, sempre</p>

			<span>{currentDate}</span>
		</header>
	);
}