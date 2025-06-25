"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Copy, Check, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { getSeparatorSuggestionAction } from "@/app/actions";
import { type SuggestSeparatorsOutput } from "@/ai/flows/suggest-separators";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

type PasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [copied, setCopied] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<SuggestSeparatorsOutput | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    let charPool = "";
    const guaranteedChars: string[] = [];

    if (options.lowercase) {
      charPool += LOWERCASE_CHARS;
      guaranteedChars.push(LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]);
    }
    if (options.uppercase) {
      charPool += UPPERCASE_CHARS;
      guaranteedChars.push(UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]);
    }
    if (options.numbers) {
      charPool += NUMBER_CHARS;
      guaranteedChars.push(NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]);
    }
    if (options.symbols) {
      charPool += SYMBOL_CHARS;
      guaranteedChars.push(SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]);
    }

    if (charPool === "") {
      setPassword("");
      return;
    }

    const remainingLength = options.length - guaranteedChars.length;
    let randomChars = "";
    for (let i = 0; i < remainingLength; i++) {
      randomChars += charPool[Math.floor(Math.random() * charPool.length)];
    }

    const shuffledPassword = (randomChars + guaranteedChars.join(''))
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    setPassword(shuffledPassword);
    setSuggestionResult(null);
  }, [options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Your new password is ready to use.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSuggestion = () => {
    startTransition(async () => {
      const result = await getSeparatorSuggestionAction(password);
      setSuggestionResult(result);
    });
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-card">
          <CardTitle className="text-3xl font-bold tracking-tight text-center sm:text-left">
            PassForge
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Create strong and secure passwords tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="relative">
            <Input
              readOnly
              value={password}
              className="h-14 pr-24 text-lg font-mono tracking-wider text-center bg-primary/5"
              placeholder="Your password will appear here"
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={generatePassword} aria-label="Generate new password">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy password">
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="length" className="text-base">Password Length</Label>
              <span className="w-12 rounded-md border border-input bg-background px-2 py-1 text-center text-base font-semibold">
                {options.length}
              </span>
            </div>
            <Slider
              id="length"
              min={6}
              max={64}
              step={1}
              value={[options.length]}
              onValueChange={(val) => setOptions(prev => ({ ...prev, length: val[0] }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-3">
              <Switch id="uppercase" checked={options.uppercase} onCheckedChange={(checked) => setOptions(prev => ({...prev, uppercase: checked}))} />
              <Label htmlFor="uppercase" className="text-base">Include Uppercase</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="lowercase" checked={options.lowercase} onCheckedChange={(checked) => setOptions(prev => ({...prev, lowercase: checked}))} />
              <Label htmlFor="lowercase" className="text-base">Include Lowercase</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="numbers" checked={options.numbers} onCheckedChange={(checked) => setOptions(prev => ({...prev, numbers: checked}))} />
              <Label htmlFor="numbers" className="text-base">Include Numbers</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="symbols" checked={options.symbols} onCheckedChange={(checked) => setOptions(prev => ({...prev, symbols: checked}))} />
              <Label htmlFor="symbols" className="text-base">Include Symbols</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Improve Readability</CardTitle>
          <CardDescription>Use AI to suggest separators that make your password easier to remember without compromising security.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSuggestion} disabled={isPending || !password} className="w-full">
            <Sparkles className="mr-2 h-4 w-4"/>
            {isPending ? "Analyzing..." : "Suggest Separators"}
          </Button>

          {isPending && (
             <div className="space-y-4 mt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
             </div>
          )}

          {suggestionResult && !isPending && (
             'error' in suggestionResult ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{suggestionResult.error}</AlertDescription>
                </Alert>
             ) : (
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Suggested Separator</h4>
                  <p className="font-mono p-2 bg-primary/5 rounded-md text-primary mt-1">{suggestionResult.suggestedSeparators}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Reasoning</h4>
                  <p className="text-muted-foreground mt-1">{suggestionResult.reasoning}</p>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
