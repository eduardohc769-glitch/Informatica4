import QRCode from 'qrcode';

/**
 * Generates standard Wi-Fi QR string format:
 * WIFI:T:WPA;S:SSID_NAME;P:PASSWORD;H:false;;
 */
export function buildWifiString(ssid: string, password: string, hidden: boolean = false, security: string = 'WPA'): string {
  // Escape special characters in SSID & password according to ZXing standard
  const escapeVal = (val: string) => val.replace(/([\\;,:"])/g, '\\$1');
  const sec = security === 'Open' ? 'nopass' : 'WPA';
  return `WIFI:T:${sec};S:${escapeVal(ssid)};P:${escapeVal(password)};H:${hidden ? 'true' : 'false'};;`;
}

export async function generateWifiQRCodeDataUrl(ssid: string, password: string, hidden: boolean = false): Promise<string> {
  const wifiString = buildWifiString(ssid, password, hidden);
  try {
    return await QRCode.toDataURL(wifiString, {
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Muy Débil' | 'Débil' | 'Aceptable' | 'Fuerte' | 'Excelente';
  color: string;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Al menos 8 caracteres');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Incluye letras mayúsculas');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Incluye números');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Incluye símbolos como !@#$');

  const normalized = Math.min(4, Math.max(0, Math.floor(score * 0.8)));

  const map = [
    { label: 'Muy Débil' as const, color: 'text-red-500 bg-red-500' },
    { label: 'Débil' as const, color: 'text-orange-500 bg-orange-500' },
    { label: 'Aceptable' as const, color: 'text-amber-500 bg-amber-500' },
    { label: 'Fuerte' as const, color: 'text-emerald-500 bg-emerald-500' },
    { label: 'Excelente' as const, color: 'text-green-600 bg-green-600' },
  ];

  return {
    score: normalized,
    label: map[normalized].label,
    color: map[normalized].color,
    feedback,
  };
}

export function generateRandomStrongPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*+?';
  let result = '';
  // Ensure mix
  const lettersUpper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const lettersLower = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*+';

  result += lettersUpper[Math.floor(Math.random() * lettersUpper.length)];
  result += lettersLower[Math.floor(Math.random() * lettersLower.length)];
  result += numbers[Math.floor(Math.random() * numbers.length)];
  result += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  // Shuffle
  return result.split('').sort(() => 0.5 - Math.random()).join('');
}
