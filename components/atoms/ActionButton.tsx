import type { AnchorHTMLAttributes } from "react";

type ActionButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function ActionButton({ children, ...props }: ActionButtonProps) {
  return <a {...props}>{children}</a>;
}
