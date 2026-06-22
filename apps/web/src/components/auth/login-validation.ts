const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Informe seu e-mail corporativo";
  if (!EMAIL_REGEX.test(trimmed)) return "Digite um e-mail válido";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Informe sua senha";
  if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres";
  return undefined;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}
