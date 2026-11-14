import { asset } from "../data/content";
import dimensions from "../data/imageDimensions.json";

// Never create a larger raster from a small source. The variants are downsampled.
export default function ProjectImage({
  src,
  alt = "",
  className = "",
  eager = false,
  sizes = "(max-width: 600px) 100vw, 50vw",
  style,
  ...props
}) {
  const info = dimensions[src];
  const stem = src.replace(/\.webp$/, "");
  const variants = [480, 960]
    .map((w) => `${stem}-${w}.webp`)
    .filter((name) => dimensions[name]);
  const srcSet = variants.length
    ? [...variants, src]
        .map((name) => `${asset(name)} ${dimensions[name].width}w`)
        .join(", ")
    : undefined;
  return (
    <img
      src={asset(src)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      width={info?.width}
      height={info?.height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      style={{
        maxWidth: info ? `min(100%, ${info.width}px)` : "100%",
        ...style,
      }}
      {...props}
    />
  );
}
