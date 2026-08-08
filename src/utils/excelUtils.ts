import * as XLSX from "xlsx";
import { ComicItem } from "../services/firebase";

import { capitalizeTitle } from "./textUtils";

export function exportComicsToExcel(comics: ComicItem[], fileName = "M1yuki_Reading_List.xlsx") {
  const exportData = comics.map((c) => ({
    No: c.no || "",
    Title: capitalizeTitle(c.title),
    Ch: c.chapter,
    Rating: c.rating,
    Genre: Array.isArray(c.genre) ? c.genre.join(", ") : c.genre || "",
    Status: c.status,
    Author: c.author || "",
    Studio: c.studio || "",
    Type: c.type || "Manga",
    ReleaseDate: c.releaseDate || "",
    Synopsis: c.synopsis || "",
    "My Opinion": c.myOpinion || "",
    CreatedAt: c.createdAt || new Date().toISOString(),
    UpdatedAt: c.updatedAt || new Date().toISOString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reading List");
  XLSX.writeFile(workbook, fileName);
}

export function downloadExcelTemplate() {
  const templateData = [
    {
      No: 1,
      Title: "Sample Comic Title",
      Ch: 100,
      Rating: 9.0,
      Genre: "Action, Adventure, Fantasy",
      Status: "Ongoing",
      Author: "Author Name",
      Studio: "Studio Name",
      Type: "Manhwa",
      ReleaseDate: "2024-01-01",
      Synopsis: "Story summary goes here...",
      "My Opinion": "Highly recommended!",
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  XLSX.writeFile(workbook, "Reading_List_Import_Template.xlsx");
}

export function parseExcelFile(file: File): Promise<Partial<ComicItem>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

        const items: Partial<ComicItem>[] = json.map((row, idx) => {
          const title = String(row["Title"] || row["title"] || `Untitled ${idx + 1}`).trim();
          const chapter = Number(row["Ch"] || row["Chapter"] || row["chapter"] || 0);
          const rating = Number(row["Rating"] || row["rating"] || 0);
          const rawGenre = String(row["Genre"] || row["genre"] || "");
          const genre = rawGenre ? rawGenre.split(",").map((g) => g.trim()) : [];
          const status = String(row["Status"] || row["status"] || "Ongoing").trim();
          const myOpinion = String(row["My Opinion"] || row["Status/My Personal Opinion"] || "").trim();

          return {
            no: Number(row["No"] || idx + 1),
            title,
            chapter,
            rating,
            genre,
            status,
            myOpinion,
            img: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        resolve(items);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}