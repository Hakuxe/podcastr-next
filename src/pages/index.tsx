import { useEffect } from "react";
import axios from 'axios';
import Header from "../components/Header";



//SSR (Server Side Rendering)
//SSG (Server Side Generation)

export default function Home(props) {

   console.log(props)

   //SPA (Single Page Application)
   // useEffect(()=>{
   //    axios.get('http://localhost:3333/episodes')
   //       .then(response => {
   //          console.log(response.data)
   //       })
   // }, [])

	return (
		<>
			<h1>index</h1>
         <p>{JSON.stringify(props.episodes)}</p>
		</>
	)
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

export async function getStaticProps(){

   const response = await axios.get('http://localhost:3333/episodes');
   const data = response.data;

   return(
      {
         props:{
            episodes: data
         }, 
         revalidate: 60 * 60 * 8 //(8 horas) de quanto em quanto tempo gerar uma nova versão dos dados
      }
   )

}
