import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db, ComicItem } from "./firebase";
import { seedInitialData } from "./seedService";

const COMICS_COLLECTION = "comics";

import { initialComicData } from "./seedService";

export async function fetchAllComics(): Promise<ComicItem[]> {
  try {
    const comicsRef = collection(db, COMICS_COLLECTION);
    const snapshot = await getDocs(comicsRef);

    if (snapshot.empty) {
      await seedInitialData();
      const reSnapshot = await getDocs(comicsRef);
      if (!reSnapshot.empty) {
        return reSnapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as ComicItem),
          id: docSnap.id,
        }));
      }
    } else {
      return snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as ComicItem),
        id: docSnap.id,
      }));
    }
  } catch (err) {
    console.warn("Firestore connection unavailable, using local seed fallback:", err);
  }

  // Guaranteed fallback dataset if Firestore is offline or unconfigured
  return initialComicData.map((item, idx) => ({
    ...item,
    id: `local-seed-${item.no || idx}`,
  }));
}

export async function createComic(item: Omit<ComicItem, "id">): Promise<string> {
  const comicsRef = collection(db, COMICS_COLLECTION);
  const docRef = await addDoc(comicsRef, item);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateComic(id: string, updates: Partial<ComicItem>): Promise<void> {
  const docRef = doc(db, COMICS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteComic(id: string): Promise<void> {
  const docRef = doc(db, COMICS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function bulkUpdateStatus(ids: string[], status: string): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  ids.forEach((id) => {
    const docRef = doc(db, COMICS_COLLECTION, id);
    batch.update(docRef, { status, updatedAt: now });
  });
  await batch.commit();
}

export async function bulkDeleteComics(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    const docRef = doc(db, COMICS_COLLECTION, id);
    batch.delete(docRef);
  });
  await batch.commit();
}

export async function batchImportComics(items: Partial<ComicItem>[]): Promise<void> {
  const comicsRef = collection(db, COMICS_COLLECTION);
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  items.forEach((item, index) => {
    const newDocRef = doc(comicsRef);
    const newItem: ComicItem = {
      id: newDocRef.id,
      no: item.no || index + 1,
      title: item.title || "Untitled",
      chapter: item.chapter || 0,
      rating: item.rating || 0,
      genre: item.genre || [],
      status: item.status || "Ongoing",
      myOpinion: item.myOpinion || "",
      img: item.img || "",
      createdAt: item.createdAt || now,
      updatedAt: now,
    };
    batch.set(newDocRef, newItem);
  });

  await batch.commit();
}