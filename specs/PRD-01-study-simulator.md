# PRD-01: Simulador de Questões de Alta Performance (Argus Arena)

## 1. Visão Geral
Mecanismo de resolução de questões para Concursos e OAB focado em ergonomia mobile, redução de fadiga cognitiva e feedback instantâneo.

## 2. Requisitos Funcionais
1. **Riscar Alternativa com 1 Toque**: Botão individual em cada opção (A, B, C, D, E) para tachar e esmaecer distratores incorretos sem responder a questão.
2. **Comentário & Lei Seca Inline**: Ao confirmar a resposta, abrir instantaneamente a fundamentação teórica, o artigo de lei vinculado e a análise de pegadinha da banca abaixo das opções, sem exigir scroll ou navegação externa.
3. **Escala Tipográfica Ajustável**: Botões `A- / A+` para ajustar a fonte do enunciado e alternativas entre 4 níveis (sm, base, lg, xl).
4. **Telemetria de 1 Toque**: Micro-componente de feedback com 5 tags pré-definidas (*Questão desatualizada*, *Explicação confusa*, *Erro no sistema*, *Gabarito controverso*, *Faltou citar artigo/lei*).

## 3. Critérios de Aceite (Acceptance Criteria)
- [x] O clique no ícone de tesoura da opção B deve tachar o texto e reduzir a opacidade para 40%.
- [x] Ao avançar para a próxima questão, as alternativas riscadas devem ser resetadas automaticamente.
- [x] O bloco inline de fundamentação deve renderizar a citação exata da Lei Seca se `currentQuestion.codeCitation` existir.
- [x] O CTA de confirmação e avanço deve possuir altura mínima de 48px (Lei de Fitts).
- [x] Testes unitários cobrindo o estado de alternativas riscadas e escala tipográfica devem passar 100%.
