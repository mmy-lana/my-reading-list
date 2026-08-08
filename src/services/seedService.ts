import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db, ComicItem } from "./firebase";

export const initialComicData: Omit<ComicItem, "id">[] = [
  { no: 1, title: "Legend of the northern blade", chapter: 202, rating: 9.5, genre: ["Action", "Adventure", "Martial Arts"], status: "END", myOpinion: "END", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 2, title: "Solo leveling", chapter: 200, rating: 9.0, genre: ["Action", "Adventure", "Fantasy", "Shounen"], status: "END", myOpinion: "END", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 3, title: "Again my life", chapter: 141, rating: 9.0, genre: ["Action", "Drama", "Shounen"], status: "END", myOpinion: "END, The main character's goal has been completed", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 4, title: "Reaper of the Drifting Moon", chapter: 135, rating: 9.0, genre: ["Action", "Martial Arts"], status: "S3 - END", myOpinion: "S3 - END", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 5, title: "The Heavenly Demon Can't Live a Normal Life", chapter: 191, rating: 9.5, genre: ["Action", "Fantasy"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 6, title: "Nano Machine", chapter: 277, rating: 9.0, genre: ["Action", "Adventure", "Fantasy", "Martial Arts"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 7, title: "This is The Law", chapter: 66, rating: 8.5, genre: ["Drama", "Legal"], status: "S2 Start", myOpinion: "S2 Start", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 8, title: "The World After the Fall", chapter: 61, rating: 8.5, genre: ["Action", "Adventure", "Fantasy"], status: "Ongoing", myOpinion: "Same author with ORV, ORV 500 CH novel they crossover", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 9, title: "Sword Fanatic Wanders Through The Night", chapter: 36, rating: 8.5, genre: ["Action", "Martial Arts"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 10, title: "Return of the Mad Demon", chapter: 134, rating: 8.5, genre: ["Action", "Fantasy", "Martial Arts", "Shounen"], status: "Ongoing", myOpinion: "The Return of the Crazy Demon", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isTopTen: true },
  { no: 18, title: "The World’s Best Engineer", chapter: 210, rating: 10.0, genre: ["Action", "Comedy", "Fantasy"], status: "END", myOpinion: "The Greatest Estate Developer (beautiful ending)", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 32, title: "Return of the Mount Hua Sect", chapter: 135, rating: 8.0, genre: ["Action", "Adventure", "Fantasy"], status: "Ongoing", myOpinion: "Enjoyable", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 35, title: "The Beginning After The End", chapter: 222, rating: 8.0, genre: ["Action", "Adventure", "Fantasy", "Isekai", "School Life"], status: "Ongoing", myOpinion: "The Artist Leave, Sad", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 36, title: "Omniscient Readers Viewpoint", chapter: 246, rating: 8.0, genre: ["Action", "Fantasy"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 91, title: "magic emperor", chapter: 602, rating: 7.0, genre: ["Action", "Adventure", "Fantasy", "Magic", "Martial Arts"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 187, title: "apotheosis", chapter: 967, rating: 6.5, genre: ["Action", "Fantasy", "Martial Arts"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 250, title: "Myst, Might, Mayhem", chapter: 109, rating: 8.0, genre: ["Action", "Martial Arts"], status: "s1 end", myOpinion: "s1 end", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 276, title: "I Was Mistaken As a Monstrous Genius Actor", chapter: 89, rating: 8.0, genre: ["Drama", "Slice of Life"], status: "Ongoing", myOpinion: "I Was Immediately Mistaken for a Monster Genius Actor", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 299, title: "A Regressor's Tale of Cultivation", chapter: 25, rating: 8.5, genre: ["Action", "Fantasy", "Cultivation"], status: "S1 End", myOpinion: "S1 End", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { no: 300, title: "Reincarnated Murim Lord", chapter: 114, rating: 8.0, genre: ["Action", "Martial Arts"], status: "Ongoing", myOpinion: "", img: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export async function seedInitialData(): Promise<number> {
  const comicsRef = collection(db, "comics");
  const snapshot = await getDocs(comicsRef);

  if (!snapshot.empty) {
    return 0; // Already seeded
  }

  const batch = writeBatch(db);
  initialComicData.forEach((item) => {
    const newDocRef = doc(comicsRef);
    batch.set(newDocRef, {
      ...item,
      id: newDocRef.id,
    });
  });

  await batch.commit();
  return initialComicData.length;
}