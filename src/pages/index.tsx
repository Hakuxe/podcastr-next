import { useContext, useEffect } from "react";

import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head  from "next/head";

import axios from "axios";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import Header from "../components/Header/Header";

import { api } from "../services/episodes.service";
import convertDurationToTimeString from "../helpers/convertDurationToTimeString";

import styles from "./home.module.scss";
import Player from "../components/Player/Player";
import { PlayerContext } from "../contexts/PlayerContext";


//SSR (Server Side Rendering)
//SSG (Server Side Generation)

type Episode = {
   id: string;
   title: string;
   members: string;
   publishedAt: string;
   thumbnail: string;
   url: string;
   duration: number;
   durationAsString: string;
};

type HomeProps = {
   latestEpisodes: Array<Episode>;
   allEpisodes: Array<Episode>;
};

export default function Home(props: HomeProps) {
   const { latestEpisodes, allEpisodes } = props;
   const { playList } = useContext(PlayerContext);

   const episodeList = [...latestEpisodes, ...allEpisodes];

   //SPA (Single Page Application)
   // useEffect(()=>{
   //    axios.get('http://localhost:3333/episodes')
   //       .then(response => {
   //          console.log(response.data)
   //       })
   // }, [])

   return (
      <div className={styles.homepage}>
         <Head>
            <title>Home | podcastr</title>
         </Head>

         <section className={styles.latestEpisodes}>
            <h2>Últimos lançamentos</h2>
            <ul>
               {latestEpisodes.map((episode, index) => {
                  return (
                     <li key={episode.id}>
                        <Image
                           height={192}
                           width={192}
                           src={episode.thumbnail}
                           alt={episode.title}
                           objectFit="cover"
                        />

                        <div className={styles.episodeDetails}>
                           <Link href={`/episodes/${episode.id}`}>
                              <a>{episode.title}</a>
                           </Link>
                           <p>{episode.members}</p>
                           <span>{episode.publishedAt}</span>
                           <span>{episode.durationAsString}</span>
                        </div>
                        <button type="button" onClick={() => playList(episodeList, index)}>
                           <img src="/play-green.svg" alt="Tocar episódio" />
                        </button>
                     </li>
                  );
               })}
            </ul>
         </section>

         <section className={styles.allEpisodes}>
            <h2>Todos os episódios</h2>

            <table cellSpacing={0}>
               <thead>
                  <tr>
                     <th></th>
                     <th>Podcast</th>
                     <th>Integrantes</th>
                     <th>Data</th>
                     <th>Duração</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {allEpisodes.map((episode, index) => {
                     return (
                        <tr>
                           <td>
                              <Image
                                 width={192}
                                 height={192}
                                 src={episode.thumbnail}
                                 alt={episode.title}
                                 objectFit="cover"
                              />
                           </td>
                           <td>
                              <Link href={`/episodes/${episode.id}`}>
                                 <a>{episode.title}</a>
                              </Link>
                           </td>
                           <td>{episode.members}</td>
                           <td style={{ width: 102 }}>{episode.publishedAt}</td>
                           <td>{episode.durationAsString}</td>
                           <td>
                              <button type="button" onClick={()=> playList(episodeList, index+ latestEpisodes.length)}>
                                 <img
                                    src="/play-green.svg"
                                    alt="Tocar episódio"
                                 />
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </section>
      </div>
   );
}

// SSR
// quando os dados da aplicação tem que ser carregados antes da página abrir
// export async function getServerSideProps(){

//    const response = await axios.get('http://localhost:3333/episodes');
//    const data = response.data;

//    return(
//       {
//          props:{
//             episodes: data
//          }
//       }
//    )

// }

// SSG
//se a página não recebe atualizações toda hora

export const getStaticProps: GetStaticProps = async () => {
   const response = await api.get("/episodes", {
      params: {
         _limit: 12,
         _sort: "published_at",
         _order: "desc",
      },
   });
   const data = response.data;

   //formatando os dados antes de exibir
   const episodes = data.map((episode) => {
      return {
         id: episode.id,
         title: episode.title,
         thumbnail: episode.thumbnail,
         members: episode.members,
         publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
            locale: ptBR,
         }),
         duration: Number(episode.file.duration),
         durationAsString: convertDurationToTimeString(
            Number(episode.file.duration)
         ),
         url: episode.file.url,
      };
   });

   const latestEpisodes = episodes.slice(0, 2);
   const allEpisodes = episodes.slice(2, episodes.length);

   return {
      props: {
         latestEpisodes,
         allEpisodes,
      },
      revalidate: 60 * 60 * 8, //(8 horas) de quanto em quanto tempo gerar uma nova versão dos dados
   };
};
