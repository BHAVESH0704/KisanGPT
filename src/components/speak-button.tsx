"use client";

import { Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";


export function SpeakButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true);
    }
     // Cleanup on component unmount
     return () => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
  }, []);

  const handleSpeak = () => {
    if (!isSupported) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Prefer Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => voice.lang === 'en-IN');
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    utterance.lang = "en-IN";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error", event);
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };
  
  if (!isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSpeak}
            disabled={!text}
            aria-label="Speak text"
          >
            <Volume2 className={`h-5 w-5 ${isSpeaking ? "text-accent" : ""}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSpeaking ? "Stop Speaking" : "Speak Text"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
