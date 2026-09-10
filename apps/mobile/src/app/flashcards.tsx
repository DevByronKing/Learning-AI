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
import { MOCK_FLASHCARDS, MobileFlashcard } from '../data/mockData';

export default function FlashcardsScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(14);
  const [retentionRate, setRetentionRate] = useState(88);

  const card: MobileFlashcard = MOCK_FLASHCARDS[currentIndex] || MOCK_FLASHCARDS[0];

  const handleNextCard = (rating: 'errei' | 'dificil' | 'bom' | 'facil') => {
    setIsFlipped(false);
    setReviewedCount(c => c + 1);
    if (rating === 'errei') {
      setRetentionRate(r => Math.max(50, r - 2));
    } else if (rating === 'facil') {
      setRetentionRate(r => Math.min(99, r + 1));
    }
    setCurrentIndex(prev => (prev + 1) % MOCK_FLASHCARDS.length);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ALGORITMO ANKI / SM-2</Text>
            </View>
            <Text style={styles.counterText}>
              Card {currentIndex + 1} de {MOCK_FLASHCARDS.length}
            </Text>
          </View>
          <Text style={styles.screenTitle}>Flashcards Inteligentes</Text>
        </View>

        <View style={styles.retentionBox}>
          <Text style={styles.retentionPercent}>{retentionRate}%</Text>
          <Text style={styles.retentionLabel}>Retenção</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status de Revisão Diária */}
        <View style={styles.progressSummaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{reviewedCount}</Text>
            <Text style={styles.summaryLabel}>Revisados Hoje</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>4</Text>
            <Text style={styles.summaryLabel}>Cards no Deck</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>2.4x</Text>
            <Text style={styles.summaryLabel}>Fator de Memória</Text>
          </View>
        </View>

        {/* Card Interativo com Frente e Verso */}
        <TouchableOpacity 
          style={[styles.flashcardContainer, isFlipped && styles.flashcardFlipped]} 
          activeOpacity={0.9}
          onPress={() => setIsFlipped(!isFlipped)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.topicBadge}>
              <Ionicons name="sparkles" size={14} color="#818CF8" />
              <Text style={styles.topicText}>{card.subject} • {card.topic}</Text>
            </View>
            <View style={styles.sideBadge}>
              <Text style={styles.sideText}>{isFlipped ? 'VERSO (RESPOSTA)' : 'FRENTE (PERGUNTA)'}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {!isFlipped ? (
              <View style={styles.frontBox}>
                <Text style={styles.questionText}>{card.front}</Text>
                <View style={styles.tapToFlipPrompt}>
                  <Ionicons name="refresh" size={16} color="#94A3B8" />
                  <Text style={styles.tapToFlipText}>Toque no card para revelar o fundamento</Text>
                </View>
              </View>
            ) : (
              <View style={styles.backBox}>
                <Text style={styles.answerText}>{card.back}</Text>
                <View style={styles.ruleCitationBox}>
                  <Text style={styles.ruleCitationTag}>⚖️ FUNDAMENTO LEGAL</Text>
                  <Text style={styles.ruleCitationText}>{card.ruleCitation}</Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Botões de Ação de Autoavaliação SM-2 */}
        {isFlipped ? (
          <View style={styles.actionContainer}>
            <Text style={styles.actionPrompt}>COMO FOI SUA RECORDAÇÃO?</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.srsButton, { backgroundColor: '#450A0A', borderColor: '#EF4444' }]} 
                onPress={() => handleNextCard('errei')}
              >
                <Text style={[styles.srsBtnLabel, { color: '#F87171' }]}>Errei</Text>
                <Text style={styles.srsBtnSub}>Rever agora</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.srsButton, { backgroundColor: '#451A03', borderColor: '#F59E0B' }]} 
                onPress={() => handleNextCard('dificil')}
              >
                <Text style={[styles.srsBtnLabel, { color: '#FBBF24' }]}>Difícil</Text>
                <Text style={styles.srsBtnSub}>+1 dia</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.srsButton, { backgroundColor: '#064E3B', borderColor: '#10B981' }]} 
                onPress={() => handleNextCard('bom')}
              >
                <Text style={[styles.srsBtnLabel, { color: '#34D399' }]}>Bom</Text>
                <Text style={styles.srsBtnSub}>+3 dias</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.srsButton, { backgroundColor: '#1E1B4B', borderColor: '#6366F1' }]} 
                onPress={() => handleNextCard('facil')}
              >
                <Text style={[styles.srsBtnLabel, { color: '#818CF8' }]}>Fácil</Text>
                <Text style={styles.srsBtnSub}>+7 dias</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.revealButton} 
            onPress={() => setIsFlipped(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="eye" size={20} color="#FFFFFF" />
            <Text style={styles.revealButtonText}>Ver Resposta & Fundamento</Text>
          </TouchableOpacity>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '800',
  },
  counterText: {
    color: '#64748B',
    fontSize: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  retentionBox: {
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  retentionPercent: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '800',
  },
  retentionLabel: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#1E293B',
  },
  flashcardContainer: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 20,
    padding: 22,
    minHeight: 320,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  flashcardFlipped: {
    borderColor: '#6366F1',
    backgroundColor: '#0F172A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: '65%',
  },
  topicText: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  sideBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sideText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  frontBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  questionText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapToFlipPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tapToFlipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  backBox: {
    paddingVertical: 10,
  },
  answerText: {
    color: '#F1F5F9',
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  ruleCitationBox: {
    backgroundColor: '#1E1B4B',
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
  },
  ruleCitationTag: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  ruleCitationText: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '600',
  },
  revealButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 14,
  },
  revealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  actionContainer: {
    marginTop: 6,
  },
  actionPrompt: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  srsButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  srsBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  srsBtnSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});
