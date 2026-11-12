type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type RecognitionConstructor = new () => RecognitionLike;
const browserWindow = window as typeof window & {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};
const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
export const speechRecognitionSupported = !!Recognition;
export const speechSynthesisSupported = 'speechSynthesis' in window;

export function listen(
  onResult: (text: string) => void,
  onError: (message: string) => void,
  onEnd: () => void,
  language = 'uz-UZ',
): RecognitionLike | null {
  if (!Recognition) {
    onError('Bu brauzer ovozli kiritishni qo‘llab-quvvatlamaydi. Google Chrome yoki Microsoft Edge’dan foydalaning, yoki matn yozing.');
    onEnd();
    return null;
  }
  if (!window.isSecureContext) {
    onError('Mikrofon uchun xavfsiz ulanish kerak. localhost yoki HTTPS manzilidan foydalaning.');
    onEnd();
    return null;
  }

  const recognition = new Recognition();
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    onEnd();
  };
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim();
    if (transcript) onResult(transcript);
    else onError('Ovoz aniqlanmadi. Yana bir marta gapirib ko‘ring.');
  };
  recognition.onerror = (event) => {
    const messages: Record<string, string> = {
      'not-allowed': 'Mikrofonga ruxsat berilmagan. Brauzer sozlamalaridan mikrofon ruxsatini yoqing.',
      'service-not-allowed': 'Brauzer ovoz aniqlash xizmatiga ruxsat bermadi. Matn orqali savol yuboring.',
      'audio-capture': 'Mikrofon topilmadi. Mikrofon ulanganini tekshiring.',
      'network': 'Ovoz aniqlash xizmati internetga ulana olmadi.',
      'no-speech': 'Ovoz eshitilmadi. Mikrofonni yaqinroq tutib, qayta gapiring.',
      'language-not-supported': 'Brauzer o‘zbekcha (uz-UZ) ovoz aniqlashni qo‘llamayapti. Matn orqali savol yuboring.',
      'aborted': 'Ovozli kiritish to‘xtatildi.',
    };
    if (event.error !== 'aborted') onError(messages[event.error] || `Mikrofon xatosi: ${event.error}`);
  };
  recognition.onend = finish;
  try {
    recognition.start();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Mikrofonni ishga tushirib bo‘lmadi.');
    finish();
    return null;
  }
  return recognition;
}

export function speak(text: string, onEnd?: () => void) {
  if (!speechSynthesisSupported) return onEnd?.();
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'uz-UZ';
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('uz'));
  if (voice) utterance.voice = voice;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  speechSynthesis.speak(utterance);
}

export const stopSpeaking = () => {
  if (speechSynthesisSupported) speechSynthesis.cancel();
};
