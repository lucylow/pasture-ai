export type Lang = 'en' | 'es' | 'hi';

type Strings = {
  captureImage: string;
  aiAnalysis: string;
  getResults: string;
  takeAction: string;
};

const strings: Record<Lang, Strings> = {
  en: {
    captureImage: 'Capture image',
    aiAnalysis: 'AI analysis',
    getResults: 'Get results',
    takeAction: 'Take action',
  },
  es: {
    captureImage: 'Captura imagen',
    aiAnalysis: 'Análisis de IA',
    getResults: 'Ver resultados',
    takeAction: 'Tomar acción',
  },
  hi: {
    captureImage: 'फोटो लें',
    aiAnalysis: 'एआई विश्लेषण',
    getResults: 'परिणाम देखें',
    takeAction: 'कार्रवाई करें',
  },
};

export function t(lang: Lang, key: keyof Strings) {
  return strings[lang][key];
}
