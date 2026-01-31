import { ReactNode, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";

import {
  speak,
  extractSpeakableText,
  stopSpeaking,
} from "@/lib/voice";
import {
  showSignOverlay,
  hideSignOverlay,
} from "@/lib/sign";
import { useDyslexia } from "@/lib/DyslexiaContext";

export default function Layout({ children }: { children: ReactNode }) {
  const {
    textToSpeechEnabled,
    readOnHoverEnabled,
    signOnHoverEnabled,
  } = useDyslexia();

  const lastElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
   
    const handleFocus = (e: FocusEvent) => {
      if (!textToSpeechEnabled) return;

      const target = e.target as HTMLElement;
      if (!isReadable(target)) return;

      const text = extractSpeakableText(target);
      if (text) speak(text);
    };

    
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!isReadable(target)) return;

      if (lastElRef.current === target) return;
      lastElRef.current = target;

      const text = extractSpeakableText(target);
      if (!text) return;

     
      if (textToSpeechEnabled && readOnHoverEnabled) {
        speak(text);
      }

      
      if (signOnHoverEnabled) {
        showSignOverlay(text);
      }
    };

    
    const handlePointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as HTMLElement | null;

      if (
        lastElRef.current &&
        (!related || !lastElRef.current.contains(related))
      ) {
        lastElRef.current = null;
        hideSignOverlay();
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);

      lastElRef.current = null;
      hideSignOverlay();
      stopSpeaking();
    };
  }, [
    textToSpeechEnabled,
    readOnHoverEnabled,
    signOnHoverEnabled,
  ]);

  return (
    <>
      {}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#job-filters" className="skip-link">
        Skip to job filters
      </a>

      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <Header />

        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="focus:outline-none"
        >
          {children}
        </main>

        {}
        <div
          id="a11y-status"
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />
        <div
          id="a11y-announcer"
          className="sr-only"
          aria-live="assertive"
          aria-atomic="true"
        />

        <Footer />
      </div>
    </>
  );
}


function isReadable(el: HTMLElement | null): boolean {
  if (!el) return false;

  const badTags = ["HTML", "BODY", "MAIN"];
  if (badTags.includes(el.tagName)) return false;

  const text =
    el.getAttribute("aria-label") ||
    el.innerText ||
    el.textContent;

  return !!text && text.trim().length > 1;
}
