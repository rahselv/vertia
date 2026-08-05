"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export type ContactVariant = "tilbud" | "kontakt";

type ContactModalContextValue = {
  open: (variant?: ContactVariant) => void;
  close: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

/** Tekstinnhold per variant – «Få et tilbud» vs. vanlig «Kontakt oss». */
const copy: Record<ContactVariant, { eyebrow: string; title: string; lead: string }> = {
  tilbud: {
    eyebrow: "Få et konkret tilbud",
    title: "La oss regne på akkurat din bolig",
    lead: "Legg igjen kontaktinfo, så tar vi en uforpliktende prat og gir deg et konkret inntektsanslag.",
  },
  kontakt: {
    eyebrow: "Kontakt oss",
    title: "Ta en uforpliktende prat med oss",
    lead: "Legg igjen kontaktinfo, så tar vi kontakt for en hyggelig og helt uforpliktende prat.",
  },
};

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error(
      "useContactModal må brukes inne i en <ContactModalProvider>.",
    );
  }
  return ctx;
}

export default function ContactModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ContactVariant>("tilbud");
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((v?: ContactVariant) => {
    // Kalles noen steder direkte som onClick-handler; da er `v` et event-objekt,
    // så vi godtar kun den eksplisitte «kontakt»-strengen og faller ellers tilbake.
    setVariant(v === "kontakt" ? "kontakt" : "tilbud");
    if (typeof document !== "undefined") {
      lastFocused.current = document.activeElement as HTMLElement | null;
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Lås body-scroll mens modalen er åpen.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Esc lukker, og enkel fokus-trap (Tab holdes inne i dialogen).
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Flytt fokus inn i dialogen når den åpnes, og tilbake når den lukkes.
  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => {
        const focusable = dialogRef.current?.querySelector<HTMLElement>(
          'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])',
        );
        focusable?.focus();
      }, 50);
      return () => window.clearTimeout(id);
    }
    lastFocused.current?.focus?.();
  }, [isOpen]);

  return (
    <ContactModalContext.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay – lukker ved klikk utenfor. */}
            <button
              type="button"
              aria-label="Lukk"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0 cursor-default bg-ink-900/50 backdrop-blur-sm"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }
              }
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-soft sm:p-9"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Lukk skjema"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sand-50 text-ink-700 transition hover:bg-sand-100 hover:text-ink-900"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>

              <div className="pr-8">
                <p className="eyebrow mb-3">{copy[variant].eyebrow}</p>
                <h2
                  id="contact-modal-title"
                  className="text-2xl leading-tight sm:text-3xl"
                >
                  {copy[variant].title}
                </h2>
                <p className="mt-3 text-ink-500">{copy[variant].lead}</p>
              </div>

              <div className="mt-7">
                <ContactForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ContactModalContext.Provider>
  );
}
