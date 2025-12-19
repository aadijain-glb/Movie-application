import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const MOVIE_DATABASE = import.meta.env.VITE_APPWRITE_MOVIE_DATABASE;
const MOVIE_MATRIX = import.meta.env.VITE_APPWRITE_MOVIE_MATRIX;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (search, movie) => {
    console.log("updateSearchCount called", search, movie);

  if (!search) return;

  try {
    const result = await database.listDocuments(
      MOVIE_DATABASE,
      MOVIE_MATRIX,
      [Query.equal("search", search)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(
        MOVIE_DATABASE,
        MOVIE_MATRIX,
        doc.$id,
        { count: doc.count + 1 }
      );
    } else if (movie) {
      await database.createDocument(
        MOVIE_DATABASE,
        MOVIE_MATRIX,
        ID.unique(),
        {
          search,
          count: 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500",
        }
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(MOVIE_DATABASE, MOVIE_MATRIX, [
            Query.limit(5), 
            Query.orderDesc("count")
        ])
        return result.documents
    }catch(error){
        console.error(error)
    }
}
