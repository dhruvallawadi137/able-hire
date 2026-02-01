import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom"; // ✅ REQUIRED
import Header from "./Header";
import Footer from "./Footer";

import { speak, extractSpeakableText, stopSpeaking } from "@/lib/voice";
import { showSignOverlay, hideSignOverlay } from "@/lib/sign";
import { useDyslexia } from "@/lib/DyslexiaContext";

export default function Layout() {
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
      const text = extractSpeakableText(target);
      if (text) speak(text);
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (lastElRef.current === target) return;
      lastElRef.current = target;

      const text = extractSpeakableText(target);
      if (!text) return;

      if (textToSpeechEnabled && readOnHoverEnabled) speak(text);
      if (signOnHoverEnabled) showSignOverlay(text);
    };

    const handlePointerOut = () => {
      lastElRef.current = null;
      hideSignOverlay();
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      hideSignOverlay();
      stopSpeaking();
    };
  }, [textToSpeechEnabled, readOnHoverEnabled, signOnHoverEnabled]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <a href="#job-filters" className="skip-link">Skip to job filters</a>

      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <Header />

        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="relative z-10 focus:outline-none bg-background"
        >
          <Outlet />
        </main>

        <div id="a11y-status" className="sr-only" aria-live="polite" />
        <div id="a11y-announcer" className="sr-only" aria-live="assertive" />

        <Footer />
      </div>
    </>
  );
}
