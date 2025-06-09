// app/Services/rerum.ts

const RERUM_BASE = "https://localhost:4000";

export const createAnnotation = async (annotation: any) => {
  const response = await fetch(`${RERUM_BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(annotation)
  });

  if (!response.ok) throw new Error("Failed to create annotation");
  return response.json();
};

export const getAnnotationsByTarget = async (target: string) => {
  const response = await fetch(`${RERUM_BASE}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      target: target,
      type: "Annotation"
    })
  });

  if (!response.ok) throw new Error("Failed to fetch annotations");
  return response.json();
};

export const updateAnnotation = async (annotation: any) => {
  const response = await fetch(`${RERUM_BASE}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(annotation)
  });

  if (!response.ok) throw new Error("Failed to update annotation");
  return response.json();
};

export const deleteAnnotation = async (annotationId: string) => {
  const response = await fetch(`${RERUM_BASE}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "@id": annotationId })
  });

  if (!response.ok) throw new Error("Failed to delete annotation");
  return response.json();
};
