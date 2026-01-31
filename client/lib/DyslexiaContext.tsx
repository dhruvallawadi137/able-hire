import React, { createContext, useContext, useEffect, useState } from "react";
import { stopSpeaking } from "@/lib/voice";


const READEASE_KEY = "a11y:readease";
const READEASE_SETTINGS_KEY = "a11y:readease-settings";
const TTS_KEY = "a11y:text-to-speech";
const ROH_KEY = "a11y:read-on-hover";
const SOH_KEY = "a11y:sign-on-hover";


export interface ReadEasySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
}

const DEFAULT_SETTINGS: ReadEasySettings = {
  fontSize: 100,
  lineHeight: 1.65,
  letterSpacing: 0.02,
  wordSpacing: 0.08,
};

interface DyslexiaContextType {

  readEasyMode: boolean;
  setReadEasyMode: (enabled: boolean) => void;

  readEasySettings: ReadEasySettings;
  updateReadEasySettings: (settings: Partial<ReadEasySettings>) => void;
  resetReadEasySettings: () => void;

 
  textToSpeechEnabled: boolean;
  setTextToSpeechEnabled: (enabled: boolean) => void;

 
  readOnHoverEnabled: boolean;
  setReadOnHoverEnabled: (enabled: boolean) => void;


  signOnHoverEnabled: boolean;
  setSignOnHoverEnabled: (enabled: boolean) => void;


  announceSection: (title: string, description?: string) => void;
}


const DyslexiaContext = createContext<DyslexiaContextType | undefined>(undefined);


export function DyslexiaProvider({ children }: { children: React.ReactNode }) {
  const [readEasyMode, setReadEasyModeState] = useState(true);
  const [readEasySettings, setReadEasySettings] =
    useState<ReadEasySettings>(DEFAULT_SETTINGS);

  const [textToSpeechEnabled, setTextToSpeechEnabledState] =
    useState<boolean>(false);

  const [readOnHoverEnabled, setReadOnHoverEnabledState] =
    useState<boolean>(false);

  const [signOnHoverEnabled, setSignOnHoverEnabledState] =
    useState<boolean>(false);

  const [ready, setReady] = useState(false);

  
  useEffect(() => {
    const mode = localStorage.getItem(READEASE_KEY);
    if (mode !== null) setReadEasyModeState(mode === "1");

    const tts = localStorage.getItem(TTS_KEY);
    if (tts !== null) setTextToSpeechEnabledState(tts === "1");

    const roh = localStorage.getItem(ROH_KEY);
    if (roh !== null) setReadOnHoverEnabledState(roh === "1");

    const soh = localStorage.getItem(SOH_KEY);
    if (soh !== null) setSignOnHoverEnabledState(soh === "1");

    const storedSettings = localStorage.getItem(READEASE_SETTINGS_KEY);
    if (storedSettings) {
      try {
        setReadEasySettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings),
        });
      } catch {}
    }

    setReady(true);
  }, []);


  const setReadEasyMode = (enabled: boolean) => {
    setReadEasyModeState(enabled);
    localStorage.setItem(READEASE_KEY, enabled ? "1" : "0");
    document.documentElement.classList.toggle("a11y-dyslexic", enabled);
    applyReadEasyStyles(enabled, readEasySettings);
  };

  const updateReadEasySettings = (settings: Partial<ReadEasySettings>) => {
    const updated = { ...readEasySettings, ...settings };
    setReadEasySettings(updated);
    localStorage.setItem(READEASE_SETTINGS_KEY, JSON.stringify(updated));
    applyReadEasyStyles(readEasyMode, updated);
  };

  const resetReadEasySettings = () => {
    setReadEasySettings(DEFAULT_SETTINGS);
    localStorage.setItem(
      READEASE_SETTINGS_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );
    applyReadEasyStyles(readEasyMode, DEFAULT_SETTINGS);
  };

  const applyReadEasyStyles = (enabled: boolean, settings: ReadEasySettings) => {
    if (!enabled) return;
    const root = document.documentElement;
    root.style.setProperty("--readease-font-size", `${settings.fontSize}%`);
    root.style.setProperty("--readease-line-height", `${settings.lineHeight}`);
    root.style.setProperty(
      "--readease-letter-spacing",
      `${settings.letterSpacing}em`
    );
    root.style.setProperty(
      "--readease-word-spacing",
      `${settings.wordSpacing}em`
    );
  };

  
  const setTextToSpeechEnabled = (enabled: boolean) => {
    setTextToSpeechEnabledState(enabled);
    localStorage.setItem(TTS_KEY, enabled ? "1" : "0");
    if (!enabled) stopSpeaking();
  };

  
  const setReadOnHoverEnabled = (enabled: boolean) => {
    setReadOnHoverEnabledState(enabled);
    localStorage.setItem(ROH_KEY, enabled ? "1" : "0");
    if (!enabled) stopSpeaking();
  };

 
  const setSignOnHoverEnabled = (enabled: boolean) => {
    setSignOnHoverEnabledState(enabled);
    localStorage.setItem(SOH_KEY, enabled ? "1" : "0");
  };


  const announceSection = (title: string, description?: string) => {
    const el = document.getElementById("a11y-announcer");
    if (el) {
      el.textContent = description
        ? `${title}. ${description}`
        : title;
    }
  };

  return (
    <DyslexiaContext.Provider
      value={{
        readEasyMode,
        setReadEasyMode,
        readEasySettings,
        updateReadEasySettings,
        resetReadEasySettings,

        textToSpeechEnabled,
        setTextToSpeechEnabled,

        readOnHoverEnabled,
        setReadOnHoverEnabled,

        signOnHoverEnabled,
        setSignOnHoverEnabled,

        announceSection,
      }}
    >
      {ready && children}
    </DyslexiaContext.Provider>
  );
}


export function useDyslexia() {
  const ctx = useContext(DyslexiaContext);
  if (!ctx) {
    throw new Error("useDyslexia must be used within DyslexiaProvider");
  }
  return ctx;
}
