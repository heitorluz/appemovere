import type { Identifier } from '../../shared/identifier.ts';

import type { Mood } from './mood.ts';

export interface Entry {
  readonly id: Identifier;
  readonly mood: Mood;
}
