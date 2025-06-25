import { PasswordGenerator } from '@/components/password-generator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex w-full flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <PasswordGenerator />
      </main>
      <footer className="w-full p-6 text-center text-sm text-muted-foreground">
        <p>© 2025 PhotoRecipe. All rights reserved.</p>
        <p>Developed with ❤️ by Minjxnx</p>
      </footer>
    </div>
  );
}
