import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

export default function MobileHomeScreen() {
  const [selectedMascot, setSelectedMascot] = useState({
    name: 'Atena',
    species: 'Coruja Estrategista',
    emoji: '🦉',
    title: 'Guardiã da Sabedoria & Foco Noturno',
    advice: 'Não tente devorar todo o edital de uma vez só. O segredo da aprovação está em dominar com precisão cirúrgica os 20% que representam 80% da prova.'
  });

  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(4);
  const [streakDays, setStreakDays] = useState(14);

  const [missions, setMissions] = useState([
    { id: '1', title: 'Resolver 15 questões de Direito Previdenciário', xp: 120, done: true },
    { id: '2', title: 'Revisar 10 flashcards no deck inteligente', xp: 90, done: false },
    { id: '3', title: 'Ler 3 artigos com pegadinhas da banca Cebraspe', xp: 70, done: false },
    { id: '4', title: 'Treinar 1 redação discursiva de 30 linhas', xp: 250, done: false }
  ]);

  const toggleMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const nextDone = !m.done;
        if (nextDone) setXp(x => x + m.xp);
        return { ...m, done: nextDone };
      }
      return m;
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Superior: Nome do App + Streak */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>Learning AI</Text>
            <Text style={styles.brandSubtitle}>Copiloto Cognitivo • Concursos & OAB</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>{streakDays} dias</Text>
          </View>
        </View>

        {/* Card do Mascote Companheiro Animal */}
        <View style={styles.mascotCard}>
          <View style={styles.mascotRow}>
            <View style={styles.mascotAvatarBox}>
              <Text style={styles.mascotEmoji}>{selectedMascot.emoji}</Text>
            </View>
            <View style={styles.mascotInfo}>
              <View style={styles.mascotTagRow}>
                <Text style={styles.mascotTag}>NÍVEL {level} • {selectedMascot.species.toUpperCase()}</Text>
              </View>
              <Text style={styles.mascotName}>{selectedMascot.name}</Text>
              <Text style={styles.mascotTitle}>{selectedMascot.title}</Text>
              
              {/* Barra de XP */}
              <View style={styles.xpRow}>
                <Text style={styles.xpText}>{xp} XP / 3.000 XP</Text>
                <View style={styles.xpBarTrack}>
                  <View style={[styles.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Balão de Fala Acolhedor */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechTag}>🧭 DIREÇÃO DO DIA • SEM ANSIEDADE</Text>
            <Text style={styles.speechText}>"{selectedMascot.advice}"</Text>
          </View>
        </View>

        {/* Card do Termômetro da Nota de Corte */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Termômetro da Nota de Corte</Text>
            <Text style={styles.cardBadge}>INSS 2026</Text>
          </View>

          <View style={styles.cutoffMetricRow}>
            <View>
              <Text style={styles.cutoffLabel}>Seu Rendimento Estimado</Text>
              <Text style={styles.cutoffBigScore}>68.0%</Text>
            </View>
            <View style={styles.cutoffDivider} />
            <View>
              <Text style={styles.cutoffLabel}>Ponto de Corte Necessário</Text>
              <Text style={[styles.cutoffBigScore, { color: '#F43F5E' }]}>78.5%</Text>
            </View>
          </View>

          <View style={styles.thermometerTrack}>
            <View style={[styles.thermometerFill, { width: '68%' }]} />
            <View style={[styles.cutoffPin, { left: '78.5%' }]} />
          </View>

          <Text style={styles.cutoffDistanceText}>
            ⚡ Faltam apenas <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>10.5%</Text> para você cruzar a nota de corte para as vagas imediatas.
          </Text>
        </View>

        {/* Metas de Hoje com Dopamina */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>⭐ Metas de Hoje (Recompensa em XP)</Text>
            <Text style={styles.cardBadge}>
              {missions.filter(m => m.done).length}/{missions.length} Feitas
            </Text>
          </View>

          <View style={styles.missionsList}>
            {missions.map(mission => (
              <TouchableOpacity 
                key={mission.id}
                onPress={() => toggleMission(mission.id)}
                activeOpacity={0.8}
                style={[styles.missionItem, mission.done && styles.missionItemDone]}
              >
                <View style={[styles.checkbox, mission.done && styles.checkboxDone]}>
                  {mission.done && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                <View style={styles.missionTextCol}>
                  <Text style={[styles.missionTitle, mission.done && styles.missionTitleDone]}>
                    {mission.title}
                  </Text>
                  <Text style={styles.missionXpText}>+{mission.xp} XP para subir de nível</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ações Rápidas de Estudo */}
        <Text style={styles.sectionHeader}>AÇÕES RÁPIDAS NO CELULAR</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionBtn, { borderColor: '#6366F1' }]} activeOpacity={0.8}>
            <Text style={styles.quickActionEmoji}>📝</Text>
            <Text style={styles.quickActionLabel}>Simulado Rápido</Text>
            <Text style={styles.quickActionSub}>10 Questões</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionBtn, { borderColor: '#10B981' }]} activeOpacity={0.8}>
            <Text style={styles.quickActionEmoji}>🧠</Text>
            <Text style={styles.quickActionLabel}>Flashcards SRS</Text>
            <Text style={styles.quickActionSub}>Repetição Espaçada</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionBtn, { borderColor: '#F59E0B' }]} activeOpacity={0.8}>
            <Text style={styles.quickActionEmoji}>📜</Text>
            <Text style={styles.quickActionLabel}>Lei Seca</Text>
            <Text style={styles.quickActionSub}>Artigos Quentes</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FB923C',
  },
  mascotCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mascotAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#6366F1',
    borderWidth: 1.5,
  },
  mascotEmoji: {
    fontSize: 34,
  },
  mascotInfo: {
    flex: 1,
  },
  mascotTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FBBF24',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  mascotName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  mascotTitle: {
    fontSize: 10,
    color: '#94A3B8',
  },
  xpRow: {
    marginTop: 6,
    gap: 3,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A5B4FC',
  },
  xpBarTrack: {
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  speechBubble: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    padding: 12,
  },
  speechTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 4,
  },
  speechText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#E2E8F0',
    lineHeight: 17,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  cutoffMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  cutoffLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cutoffBigScore: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
    marginTop: 2,
  },
  cutoffDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thermometerTrack: {
    height: 12,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    position: 'relative',
    overflow: 'visible',
    marginTop: 4,
  },
  thermometerFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },
  cutoffPin: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    width: 3,
    backgroundColor: '#F43F5E',
    borderRadius: 2,
  },
  cutoffDistanceText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginTop: 2,
  },
  missionsList: {
    gap: 10,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 14,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  missionItemDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderColor: '#64748B',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkIcon: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },
  missionTextCol: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  missionTitleDone: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  missionXpText: {
    fontSize: 10,
    color: '#FBBF24',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#64748B',
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    gap: 4,
  },
  quickActionEmoji: {
    fontSize: 22,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quickActionSub: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
