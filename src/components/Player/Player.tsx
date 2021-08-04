import { useContext, useEffect, useRef } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Image from "next/image";

import styles from "./styles.module.scss";

export default function Player() {
   // acessar coisas dentro das tags html tipo o document.querySelector
   const audioRef = useRef<HTMLAudioElement>(null);

   const {
      currentEpisodeIndex,
      episodeList,
      isPlaying,
      tooglePlay,
      setPlayingState,
   } = useContext(PlayerContext);

   const episode = episodeList[currentEpisodeIndex];

   useEffect(() => {
      //current o que tem dentro da referência para a tag audio
      if (!audioRef.current) {
         return;
      }

      if (isPlaying) {
         audioRef.current.play();
      } else {
         audioRef.current.pause();
      }
   }, [isPlaying]);

   return (
      <div className={styles.playerContainer}>
         <header>
            <img src="/playing.svg" alt="Tocando agora" />
            <strong>Tocando agora</strong>
         </header>

         {episode ? (
            <div className={styles.currentEpisode}>
               <Image
                  width={592}
                  height={592}
                  src={episode.thumbnail}
                  objectFit="cover"
               />
               <strong>{episode.title}</strong>
               <span>{episode.members}</span>
            </div>
         ) : (
            <section className={styles.emptyPlayer}>
               Selecione um podcast para ouvir
            </section>
         )}

         <footer className={!episode ? styles.empty : ""}>
            <section className={styles.progressBar}>
               <span>00:00</span>
               <div className={styles.slider}>
                  {episode ? (
                     <Slider
                        trackStyle={{ backgroundColor: "#04d361" }}
                        railStyle={{ backgroundColor: "#9f75ff" }}
                     />
                  ) : (
                     <div className={styles.emptySlider} />
                  )}
               </div>
               <span>00:00</span>
            </section>

            {episode && (
               <audio
                  src={episode.url}
                  autoPlay
                  ref={audioRef}
                  onPlay={() => {setPlayingState(true);}}
                  onPause={() => {setPlayingState(false);}}
               />
            )}

            <div className={styles.playerControls}>
               <button type="button" disabled={!episode}>
                  <img src="/shuffle.svg" alt="aleatório" />
               </button>
               <button type="button" disabled={!episode}>
                  <img src="/play-previous.svg" alt="Tocar anterior" />
               </button>
               <button
                  type="button"
                  className={styles.buttonPlay}
                  disabled={!episode}
                  onClick={tooglePlay}
               >
                  {isPlaying ? (
                     <img src="/pause.svg" alt="Tocar" />
                  ) : (
                     <img src="/play.svg" alt="Tocar" />
                  )}
               </button>
               <button type="button" disabled={!episode}>
                  <img src="/play-next.svg" alt="Tocar próxima" />
               </button>
               <button type="button" disabled={!episode}>
                  <img src="/repeat.svg" alt="Repetir" />
               </button>
            </div>
         </footer>
      </div>
   );
}
