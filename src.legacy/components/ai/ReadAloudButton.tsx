import React from 'react';
import { Volume2 } from "lucide-react";
import { Button } from "../ui/button";

export function ReadAloudButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={speak}
      className={`rounded-full flex gap-2 font-bold transition-all ${isSpeaking ? 'bg-green-100 border-green-500 text-green-700 animate-pulse' : 'bg-white'}`}
    >
      <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
      {isSpeaking ? 'Reading...' : 'Read Aloud'}
    </Button>
  );
}
