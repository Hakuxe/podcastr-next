import "../styles/global.scss";

import Header from "../components/Header";
import Player from "../components/Player/Player";
import { PlayerContext } from "../contexts/PlayerContext";

import styles from "../styles/app.module.scss";
import { useState } from "react";


/** Tudo que tiver dentro do <PlayerContext.Provider value={"nome"}> tem acesso ao value
 * 
 *  Pra usar o contexto useContext( NOME DO CONTEXT );
 *  Ex: const p = useContext( PlayerContext );
 *  
 * */ 
function MyApp({ Component, pageProps }) {

   const [episodeList, setEpisodeList] = useState([]);
   const [currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
   const [isPlaying, setIsPlaying ] = useState(false);

   function play(episode){
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
   }

   function tooglePlay(){
      setIsPlaying(!isPlaying);
   }

   // pausando pelo atalho de teclado 
   function setPlayingState(state: boolean){
      setIsPlaying(state);
   }

   return (
      <div className={styles.wrapper}>
         <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying, tooglePlay,setPlayingState }}>
            <main>
               <Header />
               {/* A aplicação vai ser montada no <Component {...pageProps} /> */}
               <Component {...pageProps} />
            </main>

            <Player />
         </PlayerContext.Provider>
      </div>
   );
}

export default MyApp;
