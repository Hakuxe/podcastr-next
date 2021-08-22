import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Image from "next/image";

import styles from "./styles.module.scss";
import convertDurationToTimeString from "../../helpers/convertDurationToTimeString";

export default function Player() {
   // acessar coisas dentro das tags html tipo o document.querySelector
   const audioRef = useRef<HTMLAudioElement>(null);
   const [progress, setProgress] = useState(0);

   const {
      currentEpisodeIndex,
      episodeList,
      isPlaying,
      tooglePlay,
      setPlayingState,
      playNext,
      playPrevious,
      isLooping,
      toogleLoop,
      isShuffling,
      toogleShuffle,
      hasNext,
      clearEpisodeState
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

   function setupProgressListener(){
      audioRef.current.currentTime = 0;

      audioRef.current.addEventListener('timeupdate', () =>{
         setProgress(Math.floor(audioRef.current.currentTime))
      })
   }

   function handleSeek(amount: number){
      audioRef.current.currentTime = amount;
      setProgress(amount)
   }

   function handleEpisodeEnded(){
      if(hasNext){
         playNext();
      }else{
         clearEpisodeState();
      }
   }

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
               <span>{convertDurationToTimeString(progress)}</span>
               <div className={styles.slider}>
                  {episode ? (
                     <Slider
                        max={episode.duration}
                        value={progress}
                        onChange={handleSeek}
                        trackStyle={{ backgroundColor: "#04d361" }}
                        railStyle={{ backgroundColor: "#9f75ff" }}
                     />
                  ) : (
                     <div className={styles.emptySlider} />
                  )}
               </div>
               <span>
                  {convertDurationToTimeString(episode?.duration ?? 0)}
               </span>
            </section>

            {episode && (
               <audio
                  src={episode.url}
                  autoPlay
                  loop={isLooping}
                  ref={audioRef}
                  onPlay={() =>   { setPlayingState(true);  }}
                  onPause={() =>  { setPlayingState(false); }}
                  onLoadedMetadata={ setupProgressListener }
                  onEnded={handleEpisodeEnded}
               />
            )}

            <div className={styles.playerControls}>
               <button
                  type="button"
                  onClick={toogleShuffle}
                  className={isShuffling ? styles.isActive : ""}
                  disabled={!episode || episodeList.length === 1}
               >
                  <img src="/shuffle.svg" alt="aleatório" />
               </button>
               <button type="button" disabled={!episode} onClick={playPrevious}>
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
               <button type="button" disabled={!episode} onClick={playNext}>
                  <img src="/play-next.svg" alt="Tocar próxima" />
               </button>
               <button
                  type="button"
                  onClick={toogleLoop}
                  className={isLooping ? styles.isActive : ""}
                  disabled={!episode}
               >
                  <img src="/repeat.svg" alt="Repetir" />
               </button>
            </div>
         </footer>
      </div>
   );
}
