# GOV360 — Inteligência de Dados Públicos para Licitações

Este documento consolida a arquitetura de evolução do GOV360 para centralizar oportunidades, histórico de compras, preços públicos, contratos, fornecedores, órgãos e alertas.

## Fontes oficiais prioritárias

### Compras.gov.br Dados Abertos

Base oficial para dados federais de compras públicas. A integração deve ser orientada pelo Swagger oficial em `https://dadosabertos.compras.gov.br/swagger-ui/index.html` e pelo OpenAPI em `/v3/api-docs`.

Grupos de dados que o GOV360 deve consumir:

- Licitações e compras:
  - consulta de licitações;
  - pregões;
  - dispensas/inexigibilidades;
  - situação do processo;
  - resultado/homologação;
  - histórico por órgão/UASG;
  - itens da compra.
- Catálogos:
  - CATMAT;
  - CATSER;
  - grupos/classes de materiais e serviços;
  - unidades de fornecimento.
- Órgãos públicos:
  - órgãos superiores;
  - unidades gestoras/UASG;
  - localização e vinculação administrativa.
- Fornecedores:
  - fornecedores participantes;
  - vencedores;
  - CNPJ/CPF;
  - histórico de vitórias;
  - valores homologados.
- Contratos e atas:
  - contratos;
  - atas de registro de preço;
  - itens vinculados;
  - vigência;
  - aditivos;
  - empenhos, quando disponível.
- Pesquisa de preços:
  - preços praticados;
  - histórico por item CATMAT/CATSER;
  - preço mínimo, médio e máximo;
  - variação por órgão, UF e período.

### PNCP

Fonte nacional principal para contratações, editais, atas, contratos, órgãos, itens e documentos. Já usado pelo GOV360 para importar oportunidades.

Prioridades:

- contratações por publicação;
- documentos do edital;
- itens da contratação;
- atas;
- contratos;
- órgãos/unidades;
- atualização incremental por data.

### Portal da Transparência / CGU

Fonte para análise de risco de fornecedores.

Dados:

- CEIS;
- CNEP;
- empresas punidas;
- impedimentos;
- sanções vigentes;
- situação por CNPJ.

Requer chave de API.

### INLABS / Imprensa Nacional

Fonte para monitoramento oficial do DOU.

Dados:

- edições completas;
- XML/PDF;
- publicações por palavra-chave;
- clipping de órgãos, CNPJ, objeto e termos estratégicos.

Requer credenciais.

### dados.gov.br

Catálogo complementar de datasets públicos.

Uso:

- descoberta de bases públicas;
- enriquecimento por órgão;
- dados setoriais;
- datasets de transparência, compras e orçamento.

## Referência funcional: Alerta Licitação

A análise da página pública do Alerta Licitação indica recursos importantes para benchmark funcional, sem cópia de produto:

- busca por palavra-chave;
- busca por estado;
- busca por município;
- busca por código UASG;
- busca por modalidade;
- busca por itens;
- busca por CNAE;
- licitações por proximidade;
- tendências;
- Top 50;
- filtros por preço;
- últimas licitações capturadas;
- painel geral com licitações encerradas, abertas e vencendo hoje;
- alertas por e-mail;
- alertas por WhatsApp;
- app mobile;
- buscas avançadas salvas;
- exportação para Excel;
- gestão de certidões em plano corporativo.

O GOV360 deve superar esse padrão com inteligência própria: score de aderência, análise de edital, mapa de risco, perfil do órgão, perfil do fornecedor, histórico de preços públicos e BI executivo.

## Modelo de dados recomendado

Para escala de milhões de registros, separar dados operacionais de dados analíticos.

### Camada operacional

- `opportunities`: oportunidades normalizadas.
- `tenders`: processos acompanhados internamente.
- `documents`: documentos e certidões.
- `contracts`: contratos próprios.
- `competitors`: concorrentes monitorados.
- `competitor_wins`: vitórias/homologações de concorrentes.

### Camada pública normalizada

Recomendado evoluir o schema com:

- `public_agencies`
  - código do órgão;
  - UASG;
  - nome;
  - esfera;
  - UF;
  - município;
  - fonte.
- `public_suppliers`
  - CNPJ/CPF;
  - razão social;
  - nome fantasia;
  - UF;
  - status de sanção;
  - fontes.
- `public_procurements`
  - fonte;
  - identificador externo;
  - modalidade;
  - situação;
  - órgão;
  - UF/município;
  - datas;
  - valor estimado;
  - valor homologado.
- `public_procurement_items`
  - item;
  - descrição;
  - CATMAT/CATSER;
  - unidade;
  - quantidade;
  - valor unitário;
  - vencedor.
- `public_contracts`
  - contrato;
  - órgão;
  - fornecedor;
  - valor;
  - vigência;
  - situação;
  - aditivos.
- `public_price_references`
  - CATMAT/CATSER;
  - descrição;
  - preço mínimo;
  - preço médio;
  - preço máximo;
  - UF;
  - órgão;
  - período.
- `alert_profiles`
  - palavras-chave;
  - CNAE;
  - CATMAT/CATSER;
  - UF/município;
  - órgão;
  - modalidade;
  - faixa de valor;
  - canais de envio.
- `alert_events`
  - perfil;
  - oportunidade;
  - canal;
  - status;
  - enviado em.

## Ingestão e performance

### Estratégia de atualização

- PNCP: sincronização incremental diária e sob demanda.
- Compras.gov: sincronização por módulo, página e período.
- Contratos/atas: sincronização incremental por data de atualização.
- CGU: atualização diária de sanções.
- INLABS: clipping diário por edição do DOU.
- dados.gov: varredura semanal de datasets.

### Processamento assíncrono

Usar fila para:

- download/paginação;
- normalização;
- deduplicação;
- cálculo de score;
- geração de alertas;
- indexação para busca;
- atualização de indicadores analíticos.

### Cache

Cache recomendado:

- catálogo CATMAT/CATSER;
- órgãos/UASG;
- ranking por UF/órgão/modalidade;
- dashboards executivos;
- perfis de órgão e fornecedor.

### Índices críticos

- fonte + identificador externo;
- data de abertura;
- data de publicação;
- UF;
- município;
- órgão;
- modalidade;
- CATMAT/CATSER;
- CNPJ do fornecedor;
- texto de objeto/descrição.

## Funcionalidades GOV360 resultantes

### Dashboard inteligente

- licitações abertas hoje;
- oportunidades por UF, município, órgão, modalidade, CNAE e segmento;
- evolução mensal;
- valor total licitado, homologado e contratado;
- ranking de órgãos compradores;
- ranking de fornecedores vencedores;
- ranking de municípios.

### Inteligência comercial

- chance estimada de vitória;
- órgãos recorrentes;
- ticket médio;
- concorrentes recorrentes;
- fornecedores vencedores por região;
- tendências por categoria;
- histórico completo por item.

### Pesquisa avançada

- palavra-chave;
- CNAE;
- CATMAT/CATSER;
- município/UF;
- órgão;
- modalidade;
- processo/edital;
- faixa de valor;
- datas;
- situação.

### Alertas inteligentes

Canais:

- sistema;
- e-mail;
- WhatsApp;
- push notification.

Critérios:

- CNAE;
- palavra-chave;
- município;
- UF;
- órgão;
- valor mínimo/máximo;
- modalidade;
- CATMAT/CATSER.

### Perfis estratégicos

- perfil do órgão;
- perfil do fornecedor;
- página de preços públicos;
- BI executivo para diretoria.

