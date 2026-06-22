# GOV360 — Status do escopo

Atualizado em 22/06/2026.

## Implementado em nível MVP

- Autenticação JWT, cadastro, login e usuário autenticado.
- Dashboard executivo conectado ao banco.
- Oportunidades com filtros, favoritos, conversão em licitação e sincronização PNCP.
- Gestão de licitações com cadastro, filtros e ciclo completo de status.
- Documentos e certidões com categorias, validade e indicadores.
- Workflow com tarefas, responsáveis, status e comentários na API.
- Propostas com itens, valores, margem, impostos, frete e versões no modelo de dados.
- Pregões, sessões e registro de lances.
- Central de pregões com atualização automática, alertas operacionais e controle de status.
- Chat do pregoeiro com sessões, histórico, envio de registros e atualização periódica.
- Simulação estratégica com descontos, margem, impostos, custos, concorrência e cenários.
- Contratos, financeiro, concorrentes e auditoria em nível básico.
- Atas de registro de preço com vigência, itens, saldo e caronas.
- Upload local de editais PDF com limite de tamanho, vínculo à licitação e versionamento documental.
- Leitura automática de PDF textual com resumo, exigências, checklist, prazos e mapa inicial de riscos.
- Catálogo central de integrações oficiais com URLs por ambiente, credenciais externas, capacidades e health checks.
- Tela administrativa para PNCP, Compras.gov, Comprasnet Contratos, CGU, INLABS, dados.gov.br e SICAF.
- Importação paginada e deduplicada de oportunidades do Compras.gov.br Dados Abertos.
- Consulta estratégica de oportunidades com cards ricos, score, urgência, aderência, pesquisas favoritas e visualização tabular.
- Filtros combinados por UF, região, município, órgão, modalidade, fonte, status, valores, datas, segmento, CNAE e palavras negativas.
- Mapa vetorial real do Brasil, clicável por UF, com heatmap, ranking e filtro automático por estado.
- Modal estratégico de análise da oportunidade com resumo, indicadores, score, ações de status, conversão em licitação e acesso à fonte oficial.

## Parcial — existe base, mas falta completar o fluxo

- Análise de editais: upload e análise automática de PDFs textuais estão funcionais; falta OCR para PDFs escaneados e análise semântica avançada por modelo de IA.
- Gestão documental: há metadados e versionamento no banco; faltam armazenamento físico, upload/download, busca avançada e interface de versões.
- Certidões: faltam alertas automáticos de 90/60/30/15/7 dias e rotina de atualização de status.
- Propostas: falta editor completo por item/lote/grupo, aprovação interna e interface de versões.
- Pregões: há monitoramento periódico e alertas; falta transporte em tempo real por WebSocket e conectores com os portais.
- Robô de lances: há configuração e lance manual; falta motor automático e integrações autorizadas com portais.
- Chat do pregoeiro: API e interface estão funcionais; falta receber/enviar mensagens diretamente nos portais e suportar anexos físicos.
- Workflow: aprovações existem no banco; falta API e interface do fluxo de aprovação.
- Contratos: faltam telas e operações para aditivos, garantias, reajustes, fiscalização e consumo de saldo.
- Financeiro: faltam empenhos/faturas/recebimentos como fluxos específicos e projeção de caixa.
- Mercado e concorrentes: há indicadores básicos; faltam tendências, produtos, regiões, histórico de preços e importação automática de resultados.
- BI executivo: faltam séries históricas, filtros, gráficos, produtividade e exportações.
- Auditoria: há registros em operações pontuais; falta cobertura transversal de todas as mutações e logs detalhados de integração.

## Não implementado

- Importadores de dados para Comprasnet Contratos, CGU, INLABS e dados.gov.br; a configuração e os testes de conectividade dessas fontes já existem.
- Conectores para Licitações-e, BLL, BNC, Portal de Compras Públicas, Licitanet, Compras BR, BBMNet e portais estaduais/municipais.
- Execução automática dos perfis de busca por CNAE, CATMAT, CATSER, órgão, localidade e faixa de valor.
- Notificações internas e canais externos de alerta.
- Permissões granulares por ação e módulo; hoje há autenticação, mas não RBAC aplicado às rotas.
- Criptografia de dados sensíveis, política de sessão, backup automatizado e restauração testada.
- Jobs agendados, filas, observabilidade e monitoramento operacional.
- Testes automatizados de domínio e integração suficientes para produção.

## Próxima sequência recomendada

1. Análise real de editais e armazenamento documental.
2. Aprovações e proposta completa, fechando o ciclo pré-pregão.
3. Chat e central de pregões em tempo real.
4. Aditivos, garantias e financeiro pós-homologação.
5. RBAC, auditoria transversal, backup e testes antes de ampliar conectores.
