import type { HTMLAttributes } from "react";

export default function Eyebrow({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props}>{children}</span>;
}
