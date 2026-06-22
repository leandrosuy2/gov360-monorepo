# GOV360 - Integrações oficiais

## Configuração

As URLs e credenciais ficam exclusivamente no arquivo `.env`. Use `.env.example` como referência e nunca grave chaves reais no repositório.

| Código | Fonte | Autenticação | Variáveis |
|---|---|---|---|
| `PNCP` | PNCP API Consulta | Pública | `PNCP_API_URL` |
| `COMPRAS_GOV` | Compras.gov.br Dados Abertos | Pública | `COMPRAS_GOV_API_URL` |
| `COMPRASNET_CONTRATOS` | Comprasnet Contratos | Pública | `COMPRASNET_CONTRATOS_API_URL` |
| `CGU_TRANSPARENCIA` | Portal da Transparência | Chave HTTP | `CGU_TRANSPARENCIA_API_URL`, `CGU_API_KEY` |
| `INLABS` | Imprensa Nacional | Conta | `INLABS_URL`, `INLABS_EMAIL`, `INLABS_PASSWORD` |
| `DADOS_GOV` | dados.gov.br | Pública | `DADOS_GOV_API_URL` |
| `SICAF` | SICAF público | Consulta web assistida | `SICAF_PUBLIC_URL` |

## Endpoints internos

- `GET /integrations/catalog`: catálogo seguro, sem exposição de segredos.
- `GET /integrations/status`: testa todas as fontes configuradas.
- `GET /integrations/:code/test`: testa uma fonte.
- `POST /integrations/pncp/sync`: sincroniza oportunidades do PNCP.
- `POST /integrations/compras-gov/sync`: sincroniza oportunidades do Compras.gov.br.
- `GET /integrations/logs`: histórico das sincronizações.

## Regras operacionais

- Timeout global definido por `INTEGRATION_TIMEOUT_MS`.
- A rota de licitações do Compras.gov pode ser ajustada por `COMPRAS_GOV_TENDERS_PATH`, sem alteração de código quando o portal versionar o endpoint.
- A chave da CGU é enviada no cabeçalho `chave-api-dados`.
- INLABS permanece desativado até e-mail e senha serem fornecidos.
- SICAF é classificado como consulta assistida; não deve receber automação agressiva sem validação jurídica e técnica.
- Um teste considera respostas HTTP abaixo de 500 como fonte alcançável. Isso separa indisponibilidade de rede de autenticação ou rota específica.
- Cada importação de dados deve registrar sucesso ou erro em `integration_logs`.

## Segurança

- Não retornar credenciais pela API.
- Não registrar chaves, senhas, cookies ou conteúdo de autenticação nos logs.
- Rotacionar a chave da CGU e a senha do INLABS periodicamente.
- Restringir a tela de integrações a administradores quando o RBAC granular for ativado.
