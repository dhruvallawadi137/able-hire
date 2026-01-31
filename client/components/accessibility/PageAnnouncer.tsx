import { useEffect, useRef } from "react";
import { useDyslexia } from "@/lib/DyslexiaContext";
import { speak } from "@/lib/voice";

interface PageAnnouncerProps {
  
  title?: string;
  description?: string;

  
  message?: string;
}

export default function PageAnnouncer({
  title,
  description,
  message,
}: PageAnnouncerProps) {
  const dyslexia = useDyslexia();
  const lastSpoken = useRef<string | null>(null);

  
  const textToSpeechEnabled =
    (dyslexia as any).textToSpeechEnabled === true;

  const announceSection = dyslexia.announceSection;

 
  useEffect(() => {
    if (title) {
      announceSection(title, description);
    }
   
  }, []);


  useEffect(() => {
    if (!message) return;
    if (message === lastSpoken.current) return;

    lastSpoken.current = message;

   
    announceSection(message);

   
    if (textToSpeechEnabled) {
      speak(message);
    }
  }, [message, announceSection, textToSpeechEnabled]);

  return null;
}
