import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import convertDurationToTimeString from "../../helpers/convertDurationToTimeString";
import { api } from "../../services/episodes.service";
import styles from "./episode.module.scss";
import { useContext } from "react";
import { PlayerContext, usePlayer } from "../../contexts/PlayerContext";

type Episode = {
   id: string;
   title: string;
   thumbnail: string;
   members: string;
   publishedAt: string;
   description: string;
   duration: number;
   durationAsString: string;
   url: string;
};

type EpisodeProps = {
   episode: Episode;
};
export default function Episode(props: EpisodeProps) {
   const { episode } = props;

   const { play }= usePlayer();

   return (
      <div className={styles.episode}>
         <Head>
            <title>{episode.title} | podcastr</title>
         </Head>
         <section className={styles.thumbnailContainer}>
            <Link href={"/"}>
               <button type="button">
                  <img src={"/arrow-left.svg"} alt="Volar" />
               </button>
            </Link>
            <Image
               width={700}
               height={162}
               src={episode.thumbnail}
               alt={episode.title}
               objectFit="cover"
            ></Image>
            <button type="button" onClick={() => play(episode)}>
               <img src={"/play.svg"} alt="Volar" />
            </button>
         </section>

         <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAsString}</span>
         </header>
         <div className={styles.description}>{episode.description}</div>
      </div>
   );
}

export const getStaticPaths: GetStaticPaths = async () => {
   /**
    * buscando os 2 últimos episódios para gerar de forma estática
    */
   const { data } = await api.get("/episodes", {
      params: {
         _limit: 2,
         _sort: "published_at",
         _order: "desc",
      },
   });

   const paths = data.map((episode) => {
      return {
         params: {
            slug: episode.id,
         },
      };
   });

   return {
      /** Paths quais itens ele deve carregar estaticamente
       * path: [] = não gera nenhum estaticamente
       */
      paths,
      fallback: "blocking",
   };
};

export const getStaticProps: GetStaticProps = async (contexto) => {
   //contexto : ctx

   const { slug } = contexto.params;

   const { data } = await api.get(`/episodes/${slug}`);
   const episode = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), "d MMM yy", {
         locale: ptBR,
      }),
      description: data.description,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      url: data.file.url,
   };

   return {
      props: {
         episode,
      },
      revalidate: 60 * 60 * 48, //48 horas
   };
};
