// /app/services/history.ts

export const fetchHistory = async () => {
  const res = await fetch("http://localhost:3000/history");
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};

export const postHistory = async (data: {
  imageUrl: string;
  metadata: Record<string, any>;
}) => {
  const res = await fetch("http://localhost:3000/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to post history");
  return res.json();
};