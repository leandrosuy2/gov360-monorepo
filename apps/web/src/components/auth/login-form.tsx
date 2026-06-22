"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@gov360/ui";
import { BrandLogo } from "@/components/brand-logo";
import { IconInput } from "@/components/auth/icon-input";
import {
  validateEmail,
  validateLoginForm,
  validatePassword,
  type LoginFormErrors,
} from "@/components/auth/login-validation";
import { getLoginErrorMessage } from "@/lib/api-errors";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email), general: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, password: validatePassword(password), general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const validation = validateLoginForm({ email, password });
    if (validation.email || validation.password) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      setErrors({ general: getLoginErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center sm:mb-8">
        <BrandLogo priority />
      </div>

      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-slate-500">
          Acesse sua conta para gerenciar licitações e contratos.
        </p>
      </div>

      {errors.general && (
        <div
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mail corporativo
          </label>
          <IconInput
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="seu.email@empresa.com.br"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) {
                setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value), general: undefined }));
              }
            }}
            onBlur={() => handleBlur("email")}
            disabled={loading}
            icon={<Mail className="h-4 w-4" />}
            error={touched.email ? errors.email : undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Senha
          </label>
          <IconInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) {
                setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value), general: undefined }));
              }
            }}
            onBlur={() => handleBlur("password")}
            disabled={loading}
            icon={<Lock className="h-4 w-4" />}
            error={touched.password ? errors.password : undefined}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 transition-colors hover:text-slate-600"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-[#002776] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#001d5c] hover:shadow-lg disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Autenticando...
            </>
          ) : (
            "Entrar na plataforma"
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 sm:mt-8">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        <span className="text-center">Ambiente seguro · Acesso restrito à organização</span>
      </div>
    </div>
  );
}
