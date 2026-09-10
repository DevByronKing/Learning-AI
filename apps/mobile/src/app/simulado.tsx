import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_QUESTIONS, MobileQuestion } from '../data/mockData';

export default function SimuladoScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const question: MobileQuestion = MOCK_QUESTIONS[currentIndex] || MOCK_QUESTIONS[0];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const isCorrect = question.options.find(o => o.id === optId)?.isCorrect;
    if (isCorrect) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev + 1) % MOCK_QUESTIONS.length);
  };

  const selectedOpt = question.options.find(o => o.id === selectedOptionId);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.bancaBadgeRow}>
            <View style={styles.bancaBadge}>
              <Text style={styles.bancaBadgeText}>{question.banca.toUpperCase()}</Text>
            </View>
            <Text style={styles.yearText}>Ano {question.year}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.subjectText}>{question.subject}</Text>
          </View>
          <Text style={styles.screenTitle}>Simulado Cognitivo</Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            <Text style={{ color: '#10B981' }}>{score.correct} ✔ </Text>
            <Text style={{ color: '#EF4444' }}>{score.wrong} ✖</Text>
          </Text>
          <Text style={styles.questionCounterText}>
            {currentIndex + 1} de {MOCK_QUESTIONS.length}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card do Tópico */}
        <View style={styles.topicCard}>
          <Ionicons name="bookmark" size={16} color="#6366F1" />
          <Text style={styles.topicText}>Tópico: {question.topic}</Text>
        </View>

        {/* Enunciado */}
        <View style={styles.statementCard}>
          <Text style={styles.statementText}>{question.statement}</Text>
        </View>

        {/* Opções de Resposta */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsSectionTitle}>
            {question.format === 'certo_errado' ? 'JULGAMENTO DO ITEM:' : 'SELECIONE A ALTERNATIVA:'}
          </Text>

          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionButton,
                  isSelected && !isAnswered ? styles.optionSelected : null,
                  isAnswered && opt.isCorrect ? styles.optionCorrect : null,
                  isAnswered && isSelected && !opt.isCorrect ? styles.optionWrong : null,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(opt.id)}
              >
                <View style={styles.optionContentRow}>
                  <View style={styles.optionCircle}>
                    {isAnswered && opt.isCorrect && (
                      <Ionicons name="checkmark" size={16} color="#10B981" />
                    )}
                    {isAnswered && isSelected && !opt.isCorrect && (
                      <Ionicons name="close" size={16} color="#EF4444" />
                    )}
                    {(!isAnswered || (!isSelected && !opt.isCorrect)) && (
                      <Text style={styles.optionCircleText}>
                        {opt.id.toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <Text 
                    style={[
                      styles.optionText,
                      isAnswered && opt.isCorrect ? styles.optionTextCorrect : null,
                      isAnswered && isSelected && !opt.isCorrect ? styles.optionTextWrong : null,
                    ]}
                  >
                    {opt.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card de Análise da IA e Gabarito (Revelado após responder) */}
        {isAnswered && (
          <View style={styles.aiFeedbackCard}>
            <View style={styles.aiHeader}>
              <Ionicons 
                name={selectedOpt?.isCorrect ? "checkmark-circle" : "alert-circle"} 
                size={24} 
                color={selectedOpt?.isCorrect ? "#10B981" : "#F59E0B"} 
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.aiTitle}>
                  {selectedOpt?.isCorrect ? "Excelente! Item Acertado" : "Atenção ao Ponto Cego"}
                </Text>
                <Text style={styles.aiSubtitle}>Diagnóstico Inteligente do Copiloto</Text>
              </View>
            </View>

            {/* Alerta de Pegadinha */}
            <View style={styles.trapBox}>
              <Text style={styles.trapTag}>⚠️ PEGADINHA IDENTIFICADA PELA IA</Text>
              <Text style={styles.trapText}>{question.trapAlert}</Text>
            </View>

            {/* Fundamento Legal */}
            <View style={styles.lawBox}>
              <Text style={styles.lawTag}>📖 BASE LEGAL / ARTIGO</Text>
              <Text style={styles.lawText}>{question.lawArticle}</Text>
            </View>

            {/* Justificativa Completa */}
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTag}>💡 COMENTÁRIO EXPLICATIVO</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>

            {/* Botão Próxima Questão */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>Próxima Questão</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  bancaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bancaBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  bancaBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  yearText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#475569',
    marginHorizontal: 6,
  },
  subjectText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  scoreBox: {
    alignItems: 'flex-end',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  questionCounterText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  topicText: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  statementCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  statementText: {
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionsSectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#1E1B4B',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#450A0A',
  },
  optionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionCircleText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  optionText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  optionTextCorrect: {
    color: '#6EE7B7',
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  aiFeedbackCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  aiTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  aiSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  trapBox: {
    backgroundColor: '#451A03',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  trapTag: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  trapText: {
    color: '#FEF3C7',
    fontSize: 13,
    lineHeight: 19,
  },
  lawBox: {
    backgroundColor: '#064E3B',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  lawTag: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  lawText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
  },
  explanationBox: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 18,
  },
  explanationTag: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  explanationText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
  },
});
