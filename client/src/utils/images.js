const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiOrigin = apiBase.replace(/\/api\/?$/, "");

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("/uploads/")) return `${apiOrigin}${imageUrl}`;
  return imageUrl;
};
