'use server';

import { suggestSeparators } from '@/ai/flows/suggest-separators';
import { type SuggestSeparatorsOutput } from '@/ai/flows/suggest-separators';

export async function getSeparatorSuggestionAction(password: string): Promise<SuggestSeparatorsOutput | { error: string }> {
  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters long for a suggestion.' };
  }

  try {
    const result = await suggestSeparators({ password });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating a suggestion.' };
  }
}
