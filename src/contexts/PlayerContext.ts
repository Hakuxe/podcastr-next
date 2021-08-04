import { createContext } from "react";

type Episode={
   title: string,
   members:string,
   thumbnail:string,
   duration:number,
   url:string
}

type PlayerContextData = {
   episodeList: Array<Episode>,
   currentEpisodeIndex: number,
   isPlaying:boolean,
   play: (episode: Episode) => void,
   setPlayingState: (state: boolean) => void,
   tooglePlay:() => void
}
// definindo o formado dos dados  do contexto como string 
export const PlayerContext = createContext( {} as PlayerContextData );
