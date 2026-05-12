import { type ReactNode, type CSSProperties } from "react";
import { useReveal } from "../lib/useReveal";

type Props = {
  children: ReactNode;
  variant?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

export default function Reveal({ children, variant = "up", delay = 0, className = "" }: Props) {
  const ref = useReveal<HTMLDivElement>();
  const cls =
    variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : "reveal";
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <div ref={ref} className={`${cls} ${className}`} style={style}>
      {children}
    </div>
  );
}
