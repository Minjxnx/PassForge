'use server';

/**
 * @fileOverview Determines which kind of separators would increase readability without diminishing password strength.
 *
 * - suggestSeparators - A function that suggests separators for a password.
 * - SuggestSeparatorsInput - The input type for the suggestSeparators function.
 * - SuggestSeparatorsOutput - The return type for the suggestSeparators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSeparatorsInputSchema = z.object({
  password: z.string().describe('The password to suggest separators for.'),
});
export type SuggestSeparatorsInput = z.infer<typeof SuggestSeparatorsInputSchema>;

const SuggestSeparatorsOutputSchema = z.object({
  suggestedSeparators: z.string().describe('The suggested separators for the password.'),
  reasoning: z.string().describe('The reasoning behind the suggested separators.'),
});
export type SuggestSeparatorsOutput = z.infer<typeof SuggestSeparatorsOutputSchema>;

export async function suggestSeparators(input: SuggestSeparatorsInput): Promise<SuggestSeparatorsOutput> {
  return suggestSeparatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSeparatorsPrompt',
  input: {schema: SuggestSeparatorsInputSchema},
  output: {schema: SuggestSeparatorsOutputSchema},
  prompt: `You are an expert in password security and readability.

  Given the password: {{{password}}}

  Suggest separators that would increase readability without diminishing password strength. Explain your reasoning.

  Format your response as follows:

  Suggested Separators: <suggested separators>
  Reasoning: <reasoning behind the suggested separators>`,
});

const suggestSeparatorsFlow = ai.defineFlow(
  {
    name: 'suggestSeparatorsFlow',
    inputSchema: SuggestSeparatorsInputSchema,
    outputSchema: SuggestSeparatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
