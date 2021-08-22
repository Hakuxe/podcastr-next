import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
   title: string;
   members: string;
   thumbnail: string;
   duration: number;
   url: string;
};

type PlayerContextData = {
   episodeList: Array<Episode>;
   currentEpisodeIndex: number;
   isPlaying: boolean;
   isLooping: boolean;
   isShuffling: boolean;
   hasNext: boolean
   play: (episode: Episode) => void;
   playList: (list: Episode[], id: number) => void;
   setPlayingState: (state: boolean) => void;
   tooglePlay: () => void;
   toogleLoop: () => void;
   toogleShuffle: () => void;
   playNext: () => void;
   playPrevious: () => void;
   clearEpisodeState: () => void;
};

type PlayerContextProviderProps = {
   children: ReactNode
};
// definindo o formado dos dados  do contexto como string
export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
   const [episodeList, setEpisodeList] = useState([]);
   const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isLooping, setIsLooping] = useState(false);
   const [isShuffling, setIsShuffling] = useState(false);

   function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
   }

   function playList(list: Episode[], id: number) {
      setEpisodeList(list);
      setCurrentEpisodeIndex(id);
      setIsPlaying(true);
   }


   function tooglePlay() {
      setIsPlaying(!isPlaying);
   }

   function toogleLoop() {
      setIsLooping(!isLooping);
   }

   function toogleShuffle(){
      setIsShuffling(!isShuffling);
   }

   // pausando pelo atalho de teclado
   function setPlayingState(state: boolean) {
      setIsPlaying(state);
   }

   const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

   function playNext(){
      if(isShuffling){

         const randomEpisodeIndex = Math.floor(Math.random()* episodeList.length)
         setCurrentEpisodeIndex(randomEpisodeIndex);

      }else if(hasNext){
         setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
   }

   function playPrevious(){
      const previousEpisode = currentEpisodeIndex - 1;

      if(currentEpisodeIndex > 0){
         setCurrentEpisodeIndex(previousEpisode)
      }

   } 

   function clearEpisodeState(){
      setEpisodeList([]);
      setCurrentEpisodeIndex(0)
   }

   return (
      <PlayerContext.Provider
         value={{
            episodeList,
            currentEpisodeIndex,
            playPrevious,
            play,
            playNext,
            playList,
            isPlaying,
            tooglePlay,
            isLooping,
            toogleLoop,
            isShuffling,
            toogleShuffle,
            setPlayingState,
            hasNext,
            clearEpisodeState
           
         }}
      >
         {children}
      </PlayerContext.Provider>
   );
}

export const usePlayer = () =>{
   return useContext(PlayerContext);
}
