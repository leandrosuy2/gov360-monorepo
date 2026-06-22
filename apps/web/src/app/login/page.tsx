import { LoginForm } from "@/components/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <LoginHero />

      <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-[380px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:max-w-[400px] sm:p-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
