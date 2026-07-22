import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Send, X, Volume2, Sparkles, Keyboard, HelpCircle } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const VoiceAssistant: React.FC = () => {
  const { processVoiceCommand, theme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [useKeyboard, setUseKeyboard] = useState(false);
  const [manualInput, setManualInput] = useState('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Indian English / Hindi-English accent

      rec.onstart = () => {
        setIsListening(true);
        setFeedback('Listening...');
        setFeedbackType(null);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleExecute(text);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        setFeedback('Speech recognition error. Please type or try again.');
        setFeedbackType('error');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        setFeedback(null);
        setFeedbackType(null);
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    } else {
      setUseKeyboard(true);
      setFeedback('Voice recognition not supported in this browser. Please type.');
      setFeedbackType('error');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        startListening();
      }, 300);
    } else {
      stopListening();
      setTranscript('');
      setFeedback(null);
      setFeedbackType(null);
      setManualInput('');
    }
  };

  const handleExecute = (cmdText: string) => {
    if (!cmdText.trim()) return;
    const result = processVoiceCommand(cmdText);
    setFeedback(result.feedback);
    setFeedbackType(result.success ? 'success' : 'error');
    
    // Play voice feedback using speech synthesis (tts)
    if (window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(result.feedback);
      speech.lang = 'en-IN';
      window.speechSynthesis.speak(speech);
    }

    // Auto-close if successful after a brief period
    if (result.success) {
      setTimeout(() => {
        setIsOpen(false);
        setTranscript('');
        setFeedback(null);
        setFeedbackType(null);
        setManualInput('');
      }, 2000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    handleExecute(manualInput);
    setManualInput('');
  };

  const handleSuggestionClick = (cmd: string) => {
    setTranscript(cmd);
    handleExecute(cmd);
  };

  const sampleCommands = [
    { text: 'Sold 2 Maggi', title: 'Sell Product' },
    { text: 'Add ₹500 udhaar for Rahul', title: 'Add Credit' },
    { text: 'Show today\'s sales', title: 'Show Sales' },
    { text: 'Which products need restocking?', title: 'Check Stock' }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary hover:bg-primary-soft text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer pulse-ripple"
        title="Ask KiranaAI Voice"
      >
        <Mic size={24} />
      </button>

      {/* Assistant Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleToggle} />
          
          <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            {/* Header */}
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary animate-pulse" size={18} />
                <h3 className="font-display font-bold">KiranaAI Voice Assistant</h3>
              </div>
              <button 
                onClick={handleToggle}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col items-center">
              {/* Soundwaves or Microphone Animation */}
              {!useKeyboard && (
                <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                  {isListening ? (
                    <>
                      {/* Animated Soundwave bars */}
                      <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                      <span className="absolute inset-2 rounded-full bg-primary/20 animate-pulse" />
                      <div className="flex items-center justify-center gap-1.5 h-10">
                        <span className="w-1.5 bg-primary rounded-full animate-bounce h-8" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 bg-primary rounded-full animate-bounce h-12" style={{ animationDelay: '0.3s' }} />
                        <span className="w-1.5 bg-primary rounded-full animate-bounce h-6" style={{ animationDelay: '0.5s' }} />
                        <span className="w-1.5 bg-primary rounded-full animate-bounce h-10" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 bg-primary rounded-full animate-bounce h-7" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </>
                  ) : (
                    <button 
                      onClick={startListening}
                      className="w-20 h-20 rounded-full bg-orange-500/10 text-primary hover:bg-orange-500/20 flex items-center justify-center transition-all"
                    >
                      <Mic size={36} />
                    </button>
                  )}
                </div>
              )}

              {/* Speech Output text */}
              <div className="w-full text-center mb-6 min-h-[48px]">
                {transcript ? (
                  <p className="text-base font-medium italic">"{transcript}"</p>
                ) : (
                  <p className="text-slate-400 text-sm">
                    {isListening ? 'Speak now... (e.g. "Sold 2 Maggi")' : 'Tap the mic or select a command below'}
                  </p>
                )}
              </div>

              {/* Feedback box */}
              {feedback && (
                <div className={`w-full p-4 rounded-2xl mb-6 flex items-start gap-3 border ${
                  feedbackType === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : feedbackType === 'error'
                      ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                      : theme === 'dark' ? 'bg-slate-900 border-border-dark text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <Volume2 size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold">{feedback}</p>
                </div>
              )}

              {/* Mode Toggles: Keyboard Fallback */}
              <div className="w-full border-t border-inherit pt-5 mb-4 flex justify-between items-center">
                <button
                  onClick={() => setUseKeyboard(!useKeyboard)}
                  className={`text-xs font-semibold flex items-center gap-1 hover:underline ${
                    useKeyboard ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  <Keyboard size={14} />
                  {useKeyboard ? 'Use Voice Mode' : 'Type Command instead'}
                </button>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <HelpCircle size={10} />
                  Supports Hinglish
                </div>
              </div>

              {/* Keyboard Input Form */}
              {useKeyboard && (
                <form onSubmit={handleManualSubmit} className="w-full flex gap-2 mb-6">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type e.g., Sold 1 Atta"
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-soft transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* Suggestion Commands */}
              <div className="w-full">
                <p className="text-xs text-slate-400 font-semibold mb-3">Try asking these:</p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleCommands.map((cmd) => (
                    <button
                      key={cmd.text}
                      onClick={() => handleSuggestionClick(cmd.text)}
                      className={`p-3 rounded-2xl border text-left hover:border-primary hover:bg-orange-500/5 transition-all text-xs font-medium cursor-pointer ${
                        theme === 'dark' 
                          ? 'border-border-dark bg-slate-900 text-slate-300' 
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] text-primary block font-semibold mb-1">{cmd.title}</span>
                      <span className="line-clamp-2 leading-relaxed">"{cmd.text}"</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
