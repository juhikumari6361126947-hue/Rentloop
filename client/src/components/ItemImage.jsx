import { useEffect, useState } from "react";
import { resolveImageUrl } from "../utils/images";

const defaultImage = "/default-item.svg";

export default function ItemImage({ src, alt, className = "" }) {
  const [imageSrc, setImageSrc] = useState(resolveImageUrl(src) || defaultImage);

  useEffect(() => {
    setImageSrc(resolveImageUrl(src) || defaultImage);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt || "Rental item"}
      className={`bg-slate-100 ${className}`}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.src.endsWith(defaultImage)) return;
        setImageSrc(defaultImage);
        event.currentTarget.src = defaultImage;
      }}
    />
  );
}
