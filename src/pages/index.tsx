import { useEffect } from "react";

import { GetStaticProps } from "next";
import Image from "next/image";
import axios from "axios";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import Header from "../components/Header";

import { api } from "../services/episodes.service";
import convertDurationToTimeString from "../helpers/convertDurationToTimeString";

import styles from "./home.module.scss";

//SSR (Server Side Rendering)
//SSG (Server Side Generation)

type Episode = {
   id: string;
   title: string;
   members: string;
   publishedAt: string;
   thumbnail: string;
   description: string;
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

   //SPA (Single Page Application)
   // useEffect(()=>{
   //    axios.get('http://localhost:3333/episodes')
   //       .then(response => {
   //          console.log(response.data)
   //       })
   // }, [])

   return (
      <div className={styles.homepage}>
         <section className={styles.latestEpisodes}>
            <h2>Últimos lançamentos</h2>
            <ul>
               {latestEpisodes.map((episode) => {
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
                           <a href="">{episode.title}</a>
                           <p>{episode.members}</p>
                           <span>{episode.publishedAt}</span>
                           <span>{episode.durationAsString}</span>
                        </div>
                        <button type="button">
                           <img src="/play-green.svg" alt="Tocar episódio" />
                        </button>
                     </li>
                  );
               })}
            </ul>
         </section>

         <section className={styles.allEpisodes}></section>
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
         description: episode.description,
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
