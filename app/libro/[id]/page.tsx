import { libri } from "../../../data/libri";

export default function BookDetail({ params }: any) {

  const libro = libri.find(l => l.id === Number(params.id));

  if(!libro){
    return <p>Libro non trovato</p>;
  }

  return (

    <div style={{padding:"40px"}}>

      <h1>{libro.titolo}</h1>

      <img src={libro.img} width="200"/>

      <h3>{libro.autore}</h3>

      <p>{libro.fraseFamosa}</p>
        <p>ISBN: {libro.isbn}</p>

    </div>

  );
}