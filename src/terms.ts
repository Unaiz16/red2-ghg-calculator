import type { TermKey } from './calc';

/** Structure of the eight terms. Labels and explanations live in i18n.ts. */
export interface TermInfo {
  key: TermKey;
  /** Subscript part of the symbol, e.g. "ec" for e_ec. */
  sub: string;
  /** Whether negative values are allowed in the input. */
  allowNegative?: boolean;
}

export const TERMS: readonly TermInfo[] = [
  { key: 'eec', sub: 'ec' },
  { key: 'el', sub: 'l', allowNegative: true },
  { key: 'ep', sub: 'p' },
  { key: 'etd', sub: 'td' },
  { key: 'eu', sub: 'u' },
  { key: 'esca', sub: 'sca' },
  { key: 'eccs', sub: 'ccs' },
  { key: 'eccr', sub: 'ccr' },
];
