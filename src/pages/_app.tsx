import "../styles/global.scss";

import Header from "../components/Header/Header";
import Player from "../components/Player/Player";
import { PlayerContext } from "../contexts/PlayerContext";

import styles from "../styles/app.module.scss";
import { PlayerContextProvider } from "../contexts/PlayerContext";

/** Tudo que tiver dentro do <PlayerContext.Provider value={"nome"}> tem acesso ao value
 *
 *  Pra usar o contexto useContext( NOME DO CONTEXT );
 *  Ex: const p = useContext( PlayerContext );
 *
 * */
function MyApp({ Component, pageProps }) {
   return (
      <PlayerContextProvider>
         <div className={styles.wrapper}>
            <main>
               <Header />
               {/* A aplicação vai ser montada no <Component {...pageProps} /> */}
               <Component {...pageProps} />
            </main>

            <Player />
         </div>
      </PlayerContextProvider>
   );
}

export default MyApp;
