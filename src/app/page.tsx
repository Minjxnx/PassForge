import { PasswordGenerator } from '@/components/password-generator';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <PasswordGenerator />
    </main>
  );
}
