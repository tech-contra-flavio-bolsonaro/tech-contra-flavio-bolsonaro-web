export const MANIFESTO_VERSION = "2026-10-09-v1";
export const CONSENT_VERSION = "2026-10-09-v1";
export const CONSENT_TEXT = "Li o manifesto e autorizo o uso do meu nome, e-mail, telefone e área de atuação na tecnologia exclusivamente para registrar e validar minha assinatura. Meus dados não serão publicados nem usados para marketing.";
const areaCodes = new Set("11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99".split(" "));
export function normalizePhone(value: string): string | null {
  if (value.length > 32 || !/^\+?[\d\s().-]+$/.test(value)) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 || digits.length === 13) {
    if (!digits.startsWith("55")) return null;
    digits = digits.slice(2);
  } else if (value.startsWith("+")) return null;
  if (!areaCodes.has(digits.slice(0, 2))) return null;
  if (!/^\d{2}(?:[2-5]\d{7}|9\d{8})$/.test(digits)) return null;
  return `+55${digits}`;
}
export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(email)) return null;
  const local = email.split("@")[0];
  return local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..") ? null : email;
}
export function validText(value: string, max: number) {
  return value.trim().length >= 2 && value.trim().length <= max && !/[\u0000-\u001f\u007f]/.test(value);
}
