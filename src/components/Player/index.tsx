import styles from './styles.module.scss';

export default function Player() {
	return (
		<div className={styles.playerContainer}>
			
         <header>
            <img src="/playing.svg" alt="Tocando agora" />
            <strong>Tocando agora</strong>
         </header>

         <section className={styles.emptyPlayer}>
            Selecione um podcast para ouvir 
         </section>

         <footer>
            <section className={styles.progressBar}>
               <span>00:00</span>
               <div className={styles.emptySlider}/>
               <span>00:00</span>
            </section>

            <div className={styles.playerControls}>
               <button type="button">
                  <img src="/shuffle.svg" alt="aleatório" />
               </button>
               <button type="button">
                  <img src="/play-previous.svg" alt="Tocar anterior" />
               </button>
               <button type="button" className={styles.buttonPlay}>
                  <img src="/play.svg" alt="Tocar" />
               </button>
               <button type="button">
                  <img src="/play-next.svg" alt="Tocar próxima" />
               </button>
               <button type="button">
                  <img src="/repeat.svg" alt="Repetir" />
               </button>

            </div>


         </footer>
		</div>
	);
}