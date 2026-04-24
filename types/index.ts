export type Role = "user" | "admin";

export interface User {
  id?: number;
  nome: string;
  cognome?: string;
  email: string;
  role: Role;
}

export interface Libro {
  id: number;
  titolo: string;
  autore: string;
  isbn?: string | number;
  genere?: string;
  fraseFamosa?: string;
  img?: string;
  dataPresa?: string;
  dataRestituzione?: string;
  dataAcquisto?: string;
  utenteRole?: Role;
}

export interface Autore {
  nome: string;
  eta: number | string;
  stato?: string;
  bio: string;
  img?: string;
}

export interface Recensione {
  id: number;
  user: string;
  titolo?: string;
  testo: string;
  stelle: number;
  libroId?: number;
}

export interface Message {
  id?: string;
  toUserId?: number;
  from: "admin" | "user";
  text: string;
  date: string;
  userId?: number;
}