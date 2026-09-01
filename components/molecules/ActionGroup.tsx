import type { HTMLAttributes } from "react";

export default function ActionGroup({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}
