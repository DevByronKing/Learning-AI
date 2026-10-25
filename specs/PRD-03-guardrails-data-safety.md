# PRD-03: Guardrails de Dados & Proteção Operacional contra Ações Destrutivas

## 1. Visão Geral
Camada de governança programática e travas de código para impedir deleções acidentais, comandos SQL destrutivos ou purga indevida de dados críticos do Argus.

## 2. Requisitos Funcionais
1. **Bloqueio de Comandos SQL Destrutivos**: Interceptar e abortar qualquer comando contendo `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, ou `DELETE` sem restrição `WHERE`.
2. **Proteção de Hard Delete em Entidades Críticas**: Entidades vitais (`questions`, `student_profiles`, `audit_logs`, `exam_notices`) não podem ser deletadas do banco físico por requisições de aplicação.
3. **Soft Delete Mandatório**: Operações de remoção de dados devem aplicar flag `isDeleted=true` e carimbo de data `deletedAt`.
4. **Token de Confirmação 2FA para Lotes**: Qualquer alteração em lote no banco exige `confirmationToken` prévio.

## 3. Critérios de Aceite (Acceptance Criteria)
- [x] O validador `validateDatabaseGuardrail` bloqueia 100% das tentativas de `DROP TABLE` e `DELETE FROM questions`.
- [x] Tentativas de Hard Delete geram exceção descritiva sem drama e sem derrubar o processo.
- [x] Testes automatizados na suíte de guardrails devem validar a rejeição de comandos maliciosos ou acidentais.
