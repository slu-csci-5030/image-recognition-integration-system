// app/imageSearch/page.tsx
"use client";

import React, { useState } from "react";
import { getImageEmbeddings } from "../lib/modelClient";

export default function ImageSearchPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setImageFile(e.target.files[0]);
  }

  async function handleSearch() {
    if (!imageFile) return;
    setLoading(true);
    try {
      // For "image search," we get the embeddings from the local pipeline
      const embeddingResult = await getImageEmbeddings(imageFile);
      setResults(embeddingResult);
      // In a real scenario, we'd compare these embeddings against 
      // known embeddings in our dataset to find the closest match.
    } catch (error) {
      console.error("Error running inference:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Local Image Search (CLIP Embeddings)</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSearch} disabled={!imageFile}>
        {loading ? "Searching..." : "Get Image Embeddings"}
      </button>

      {results && (
        <div>
          <h2>Embedding Vector:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
