
export interface AnalyzeResult {
  demo: boolean;
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL;
export async function getMode(): Promise<'live' | 'demo' | 'offline'> {
  try {
    const response = await fetch(`${API_URL}/api/health`);

    if (!response.ok) return 'offline';

    const data = await response.json();
    return data.mode === 'live' ? 'live' : 'demo';
  } catch {
    return 'offline';
  }
}

export async function analyze(
  question: string,
  image: string | null
): Promise<AnalyzeResult> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, image }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'AI so‘rovini bajarib bo‘lmadi.');
  }

  return data as AnalyzeResult;
}
