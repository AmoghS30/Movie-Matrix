import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const SAVED_MOVIES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID!,
        COLLECTION_ID!,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID!, COLLECTION_ID!, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Saved Movies functionality
export const saveMovie = async (movie: Movie) => {
  try {
    await database.createDocument(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID!,
      ID.unique(),
      {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
        saved_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const unsaveMovie = async (movieId: number) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID!,
      [Query.equal("movie_id", movieId)]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID!,
        SAVED_MOVIES_COLLECTION_ID!,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID!,
      [Query.orderDesc("saved_at")]
    );

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return undefined;
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID!,
      [Query.equal("movie_id", movieId)]
    );

    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking if movie is saved:", error);
    return false;
  }
};
