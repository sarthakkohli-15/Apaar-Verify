/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Deterministic SHA-256 hash calculation
 */
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Synchronous deterministic fallback
  return syncSha256(message);
}

/**
 * Pure synchronous JS SHA-256 implementation for fast deterministic verification
 */
export function syncSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (let i = 0; i < ascii.length; i++) {
    const j = i >> 2;
    words[j] = ((words[j] || 0) << 8) | ascii.charCodeAt(i);
  }
  words[asciiBitLength >> 5] = ((words[asciiBitLength >> 5] || 0) << 8) | 0x80;
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (let j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = hash.slice(0);

    for (let i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15] || 0, w2 = w[i - 2] || 0;

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = (i < 16) ? (w[i] || 0) : ((w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff);

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const sigma0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const sigma1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const t1 = hash[7] + sigma1 + ch + k[i] + w[i];
      const t2 = sigma0 + maj;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + t1) & 0xffffffff;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (t1 + t2) & 0xffffffff;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) & 0xffffffff;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Deterministic JSON stringifier (alphabetically sorted keys)
 */
export function canonicalStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalStringify(obj[k])).join(',') + '}';
}

/**
 * Construct Merkle Tree root from a list of leaf hashes
 */
export function calculateMerkleRoot(leafHashes: string[]): string {
  if (!leafHashes || leafHashes.length === 0) {
    return syncSha256('EMPTY_TREE');
  }
  let currentLevel = [...leafHashes];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(syncSha256(currentLevel[i] + currentLevel[i + 1]));
      } else {
        // Odd number of leaves: hash with itself
        nextLevel.push(syncSha256(currentLevel[i] + currentLevel[i]));
      }
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

/**
 * Haversine formula for physical distance (in kilometers) between two coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * String normalization for names (removes honorifics, trims whitespace, standardizes variants)
 */
export function normalizeStudentName(name: string): string {
  if (!name) return '';
  let cleaned = name.toUpperCase().trim();
  // Strip common honorifics
  cleaned = cleaned.replace(/^(MR\.?|MS\.?|MRS\.?|DR\.?|SH\.?|SHRI|SMT\.?)\s+/i, '');
  // Normalize common Indian name variants
  cleaned = cleaned.replace(/\bMOHAMMAD\b|\bMOHAMMED\b|\bMOHD\.?\b|\bMD\.?\b/g, 'MOHD');
  cleaned = cleaned.replace(/\bKUMAR\b/g, 'KR');
  cleaned = cleaned.replace(/\s+/g, ' ');
  return cleaned;
}

/**
 * Fuzzy string similarity (Jaro-Winkler metric approximation)
 */
export function calculateFuzzySimilarity(s1: string, s2: string): number {
  const a = normalizeStudentName(s1);
  const b = normalizeStudentName(s2);
  if (a === b) return 1.0;
  if (!a || !b) return 0.0;

  // Simple token overlap + Levenshtein hybrid
  const tokensA = new Set(a.split(' '));
  const tokensB = new Set(b.split(' '));
  let intersection = 0;
  tokensA.forEach(t => {
    if (tokensB.has(t)) intersection++;
  });
  const tokenJaccard = intersection / Math.max(tokensA.size, tokensB.size);

  // Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  const levDist = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  const levSim = (maxLen - levDist) / maxLen;

  return Math.round((tokenJaccard * 0.4 + levSim * 0.6) * 100) / 100;
}

/**
 * Check if a CSV field has potential spreadsheet formula injection (=, +, -, @, tab, cr)
 */
export function checkFormulaInjection(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  return dangerousChars.includes(trimmed.charAt(0));
}

/**
 * Sanitize formula injection from CSV value
 */
export function sanitizeCsvValue(val: string): string {
  if (checkFormulaInjection(val)) {
    return `'${val}`; // Prefix with single quote to deactivate execution
  }
  return val;
}

/**
 * Jaccard Similarity between two sets of strings
 */
export function calculateJaccardSimilarity(setA: string[], setB: string[]): number {
  if (!setA.length || !setB.length) return 0;
  const a = new Set(setA);
  const b = new Set(setB);
  let intersection = 0;
  a.forEach(item => {
    if (b.has(item)) intersection++;
  });
  const union = new Set([...setA, ...setB]).size;
  return Math.round((intersection / union) * 100) / 100;
}

/**
 * Simulated Ed25519 / HMAC digital signature generator for credential issuance
 */
const SYSTEM_SECRET_SEED = 'AICTE_ED25519_ROOT_KEY_2026_SECURE_AUTH';

export function signCredentialPayload(claims: Record<string, any>): {
  payloadBase64: string;
  signature: string;
  jwtToken: string;
} {
  const canonical = canonicalStringify(claims);
  const payloadBase64 = btoa(unescape(encodeURIComponent(canonical)));
  const signature = syncSha256(canonical + SYSTEM_SECRET_SEED);
  const jwtToken = `apaar.v1.${payloadBase64}.${signature.substring(0, 32)}`;
  return { payloadBase64, signature, jwtToken };
}

/**
 * Verify credential payload offline using signature check
 */
export function verifyCredentialSignature(jwtToken: string): {
  valid: boolean;
  claims?: Record<string, any>;
  error?: string;
} {
  try {
    const parts = jwtToken.trim().split('.');
    if (parts.length !== 4 || parts[0] !== 'apaar' || parts[1] !== 'v1') {
      return { valid: false, error: 'Malformed token header or unsupported scheme' };
    }
    const payloadBase64 = parts[2];
    const signature = parts[3];

    const decodedStr = decodeURIComponent(escape(atob(payloadBase64)));
    const claims = JSON.parse(decodedStr);

    const expectedSignature = syncSha256(canonicalStringify(claims) + SYSTEM_SECRET_SEED).substring(0, 32);

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Digital signature mismatch (claims have been tampered or altered)' };
    }

    return { valid: true, claims };
  } catch (err: any) {
    return { valid: false, error: `Invalid credential format: ${err.message}` };
  }
}
