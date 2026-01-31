let overlay: HTMLDivElement | null = null;


export function showSignOverlay(text: string) {
  if (!text || typeof document === "undefined") return;

  hideSignOverlay();

  overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");

  overlay.style.position = "fixed";
  overlay.style.bottom = "24px";
  overlay.style.right = "24px";
  overlay.style.zIndex = "9999";
  overlay.style.background = "#ffffff"; 
  overlay.style.padding = "16px";
  overlay.style.borderRadius = "16px";
  overlay.style.boxShadow = "0 12px 30px rgba(0,0,0,.25)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.gap = "12px";
  overlay.style.maxWidth = "75vw";
  overlay.style.pointerEvents = "none";


  const words = text
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .slice(0, 8); 

  for (const word of words) {
    const wordRow = document.createElement("div");
    wordRow.style.display = "flex";
    wordRow.style.gap = "6px";
    wordRow.style.alignItems = "center";

    const letters = word
      .toUpperCase()
      .normalize("NFD")
      .replace(/[^A-Z]/g, "")
      .slice(0, 20)
      .split("");

    for (const ch of letters) {
      const img = document.createElement("img");

 
      img.src = `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${ch}.svg`;
      img.alt = `Sign language letter ${ch}`;
      img.loading = "lazy";

      img.style.width = "38px";
      img.style.height = "38px";
      img.style.objectFit = "contain";

      wordRow.appendChild(img);
    }

    if (wordRow.childElementCount > 0) {
      overlay.appendChild(wordRow);
    }
  }

  if (overlay.childElementCount > 0) {
    document.body.appendChild(overlay);
  }
}


export function hideSignOverlay() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}
