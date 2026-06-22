import { isAxiosError } from "axios";

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique se a API está em execução.";
    }

    const status = error.response.status;
    const apiMessage = error.response.data?.message;

    if (status === 401) {
      return "Credenciais inválidas. Verifique seu e-mail e senha.";
    }

    if (status === 400) {
      if (Array.isArray(apiMessage)) return apiMessage.join(". ");
      if (typeof apiMessage === "string") return apiMessage;
      return "Dados inválidos. Verifique e-mail e senha.";
    }
  }

  return "Erro ao entrar. Tente novamente.";
}
