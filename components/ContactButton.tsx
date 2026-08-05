"use client";

import type { ReactNode } from "react";
import {
  useContactModal,
  type ContactVariant,
} from "@/components/ContactModalProvider";

/**
 * Liten gjenbrukbar knapp som åpner kontaktmodalen. Lar server-komponenter
 * (Header/Footer/Pricing) trigge modalen uten selv å bli client components.
 */
export default function ContactButton({
  children,
  className,
  ariaLabel,
  variant = "tilbud",
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  variant?: ContactVariant;
}) {
  const { open } = useContactModal();
  return (
    <button
      type="button"
      onClick={() => open(variant)}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
