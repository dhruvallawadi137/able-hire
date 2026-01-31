export function speak(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
}

export function extractSpeakableText(el: HTMLElement | null): string | null {
  if (!el) return null;

  
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.trim();

  
  const title = el.getAttribute("title");
  if (title) return title.trim();

  if (el.innerText && el.innerText.trim()) {
    return el.innerText.trim();
  }

 
  if (el.textContent && el.textContent.trim()) {
    return el.textContent.trim();
  }

 
  const clickable = el.closest("button, a");
  if (clickable) {
    const label =
      clickable.getAttribute("aria-label") ||
      clickable.textContent;

    if (label && label.trim()) {
      return label.trim();
    }
  }

  return null;
}
