import type { HTMLAttributes, ReactNode } from "react";
import Eyebrow from "@/components/atoms/Eyebrow";

type SectionHeadingProps = Omit<HTMLAttributes<HTMLElement>, "children" | "title"> & {
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  title?: ReactNode;
  titleId?: string;
  description?: ReactNode;
  level?: "h1" | "h2" | "h3";
  wrapContent?: boolean;
};

export default function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  titleId,
  description,
  level = "h2",
  wrapContent = false,
  ...props
}: SectionHeadingProps) {
  const Heading = level;
  const content = (
    <>
      {title !== undefined ? <Heading id={titleId}>{title}</Heading> : null}
      {description !== undefined ? <p>{description}</p> : null}
    </>
  );

  return (
    <header {...props}>
      {eyebrow !== undefined ? <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow> : null}
      {wrapContent ? <div>{content}</div> : content}
    </header>
  );
}
