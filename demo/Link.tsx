import type { ComponentProps } from "react";

export default function Link({ href, ...props }: ComponentProps<"a">) {
  const target = href?.startsWith("/years/")
    ? `/?year=${encodeURIComponent(href.slice(7))}`
    : href;
  return <a {...props} href={target} />;
}
