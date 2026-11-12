export async function startCamera(video: HTMLVideoElement, facing: 'environment' | 'user' = 'environment') {
  if (!navigator.mediaDevices?.getUserMedia)
    throw new Error('Camera needs HTTPS (or localhost) and a supported browser.');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: facing }, width: { ideal: 1280 } }, audio: false,
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}
export function stopCamera(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}
/** Capture a compressed JPEG frame (max 640px wide) for AI analysis. */
export function captureFrame(video: HTMLVideoElement, maxW = 640, quality = 0.6): string | null {
  if (!video.videoWidth) return null;
  const s = Math.min(1, maxW / video.videoWidth);
  const c = document.createElement('canvas');
  c.width = video.videoWidth * s; c.height = video.videoHeight * s;
  c.getContext('2d')!.drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', quality);
}
