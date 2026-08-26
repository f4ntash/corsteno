"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./homeCommercial.module.css";

type HomeSectionRevealProps = {
  children: ReactNode;
  className?: string;
};

export default function HomeSectionReveal({ children, className = "" }: HomeSectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.reveal} ${className}`.trim()} data-visible={visible}>
      {children}
    </div>
  );
}
