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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MASCOTS, Mascot } from '../data/mockData';
import { MascotChatModal } from '../components/MascotChatModal';
import { MobilePaywallModal } from '../components/MobilePaywallModal';

export default function MobileHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedMascotIndex, setSelectedMascotIndex] = useState(0);
  const mascot: Mascot = MASCOTS[selectedMascotIndex];

  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(4);
  const [streakDays, setStreakDays] = useState(14);
  const [isMascotChatOpen, setIsMascotChatOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);

  const [missions, setMissions] = useState([
    { id: '1', title: 'Resolver 15 questões de Direito Previdenciário', xp: 120, done: true, route: '/simulado' },
    { id: '2', title: 'Revisar 10 flashcards no deck inteligente', xp: 90, done: false, route: '/flashcards' },
    { id: '3', title: 'Ler 3 artigos com pegadinhas da banca Cebraspe', xp: 70, done: false, route: '/simulado' },
    { id: '4', title: 'Checar evolução no diagnóstico de erros', xp: 150, done: false, route: '/diagnostico' }
  ]);

  const toggleMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const nextDone = !m.done;
        if (nextDone) setXp(x => x + m.xp);
        else setXp(x => Math.max(0, x - m.xp));
        return { ...m, done: nextDone };
      }
      return m;
    }));
  };

  const completedCount = missions.filter(m => m.done).length;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      {/* Header Superior com Inset de Segurança e Streak */}
      <View style={styles.headerRow}>
        <View>
          <TouchableOpacity 
            style={styles.brandBadgeRow}
            onPress={() => setIsPaywallOpen(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.proTag, isProUser && { backgroundColor: '#10B981' }]}>
              <Text style={styles.proTagText}>{isProUser ? 'VIP ATIVO' : 'PRO IA'}</Text>
            </View>
            <Text style={styles.brandSubtitle}>{isProUser ? 'Acesso Ilimitado' : 'Concursos & OAB'}</Text>
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Learning AI</Text>
        </View>

        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={{ marginLeft: 6 }}>
            <Text style={styles.streakText}>{streakDays} dias</Text>
            <Text style={styles.streakSub}>Foco Total</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Card do Mascote Companheiro Animal com Seletor Interativo */}
        <View style={styles.mascotCard}>
          <View style={styles.mascotRow}>
            <View style={styles.mascotAvatarBox}>
              <Text style={styles.mascotEmoji}>{mascot.emoji}</Text>
            </View>
            <View style={styles.mascotInfo}>
              <View style={styles.mascotTagRow}>
                <Text style={styles.mascotTag}>NÍVEL {level} • {mascot.species.toUpperCase()}</Text>
              </View>
              <Text style={styles.mascotName}>{mascot.name}</Text>
              <Text style={styles.mascotTitle}>{mascot.title}</Text>
              
              {/* Barra de XP */}
              <View style={styles.xpRow}>
                <Text style={styles.xpText}>{xp} XP / 3.000 XP</Text>
                <View style={styles.xpBarTrack}>
                  <View style={[styles.xpBarFill, { width: `${(xp / 3000) * 100}%` }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Balão de Fala Acolhedor do Copiloto */}
          <View style={styles.speechBubble}>
            <View style={styles.speechHeader}>
              <Ionicons name="compass" size={14} color="#818CF8" />
              <Text style={styles.speechTag}>DIREÇÃO DO DIA • SEM ANSIEDADE</Text>
            </View>
            <Text style={styles.speechText}>"{mascot.advice}"</Text>

            <TouchableOpacity
              style={styles.chatMascotBtn}
              onPress={() => setIsMascotChatOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubbles" size={14} color="#FFFFFF" />
              <Text style={styles.chatMascotBtnText}>Conversar com {mascot.name}</Text>
            </TouchableOpacity>
          </View>

          {/* Carrossel Seletor de Mascotes */}
          <View style={styles.mascotSelectorContainer}>
            <Text style={styles.selectorPrompt}>ESCOLHA SEU COMPANHEIRO ESTRATÉGICO:</Text>
            <View style={styles.selectorRow}>
              {MASCOTS.map((m, idx) => {
                const isSelected = selectedMascotIndex === idx;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.selectorBtn, isSelected && styles.selectorBtnActive]}
                    onPress={() => setSelectedMascotIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.selectorEmoji}>{m.emoji}</Text>
                    <Text style={[styles.selectorName, isSelected && styles.selectorNameActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Card do Termômetro da Nota de Corte */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.85}
          onPress={() => router.push('/diagnostico')}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="analytics" size={18} color="#38BDF8" />
              <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Termômetro da Nota de Corte</Text>
            </View>
            <Text style={styles.cardBadge}>INSS 2026</Text>
          </View>

          <View style={styles.cutoffMetricRow}>
            <View>
              <Text style={styles.cutoffLabel}>Seu Rendimento Estimado</Text>
              <Text style={styles.cutoffBigScore}>68.0%</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cutoffLabel}>Ponto de Corte Necessário</Text>
              <Text style={styles.cutoffTargetScore}>78.5%</Text>
            </View>
          </View>

          {/* Barra Visual de Proximidade */}
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: '68%' }]} />
            <View style={[styles.cutoffMarker, { left: '78.5%' }]} />
          </View>

          <View style={styles.statusAdviceRow}>
            <Ionicons name="flash" size={16} color="#F59E0B" />
            <Text style={styles.statusAdviceText}>
              Faltam apenas <Text style={{ color: '#F59E0B', fontWeight: '800' }}>10.5%</Text> para você cruzar a nota de corte para as vagas imediatas.
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </View>
        </TouchableOpacity>

        {/* Card de Metas Diárias Interativas com XP */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Metas de Hoje (Recompensa em XP)</Text>
            </View>
            <Text style={styles.missionsCounter}>{completedCount}/{missions.length} Feitas</Text>
          </View>

          {missions.map(mission => (
            <TouchableOpacity
              key={mission.id}
              style={[styles.missionItem, mission.done && styles.missionItemDone]}
              onPress={() => toggleMission(mission.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, mission.done && styles.checkboxDone]}>
                {mission.done && <Ionicons name="checkmark" size={16} color="#10B981" />}
              </View>
              
              <View style={styles.missionTextContainer}>
                <Text style={[styles.missionTitle, mission.done && styles.missionTitleDone]}>
                  {mission.title}
                </Text>
                <Text style={styles.missionXpText}>+{mission.xp} XP para subir de nível</Text>
              </View>

              <TouchableOpacity 
                style={styles.missionActionBtn} 
                onPress={() => router.push(mission.route as any)}
              >
                <Ionicons name="arrow-forward-circle" size={20} color="#6366F1" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grade de Atalhos Rápidos para Todas as Funções */}
        <Text style={styles.sectionHeader}>FUNCIONALIDADES DO APP</Text>
        <View style={styles.gridNav}>
          <TouchableOpacity 
            style={[styles.navCard, { borderColor: '#38BDF8' }]} 
            onPress={() => router.push('/simulado')}
            activeOpacity={0.8}
          >
            <View style={[styles.navIconBox, { backgroundColor: '#082F49' }]}>
              <Ionicons name="document-text" size={24} color="#38BDF8" />
            </View>
            <Text style={styles.navTitle}>Simulados</Text>
            <Text style={styles.navSub}>Cebraspe & FGV</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navCard, { borderColor: '#818CF8' }]} 
            onPress={() => router.push('/flashcards')}
            activeOpacity={0.8}
          >
            <View style={[styles.navIconBox, { backgroundColor: '#1E1B4B' }]}>
              <Ionicons name="bulb" size={24} color="#818CF8" />
            </View>
            <Text style={styles.navTitle}>Flashcards</Text>
            <Text style={styles.navSub}>Repetição SRS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navCard, { borderColor: '#F59E0B' }]} 
            onPress={() => router.push('/conquistas')}
            activeOpacity={0.8}
          >
            <View style={[styles.navIconBox, { backgroundColor: '#451A03' }]}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.navTitle}>Troféus</Text>
            <Text style={styles.navSub}>12 Medalhas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navCard, { borderColor: '#10B981' }]} 
            onPress={() => router.push('/diagnostico')}
            activeOpacity={0.8}
          >
            <View style={[styles.navIconBox, { backgroundColor: '#064E3B' }]}>
              <Ionicons name="bar-chart" size={24} color="#10B981" />
            </View>
            <Text style={styles.navTitle}>Diagnóstico</Text>
            <Text style={styles.navSub}>4 Tipos de Erro</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal de Chat com o Mascote */}
      <MascotChatModal
        visible={isMascotChatOpen}
        onClose={() => setIsMascotChatOpen(false)}
        mascot={mascot}
      />

      {/* Modal de Pagamento Pix / Paywall */}
      <MobilePaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={() => setIsProUser(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  proTag: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  proTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
  },
  streakSub: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  mascotCard: {
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1B4B',
    borderWidth: 2,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mascotEmoji: {
    fontSize: 34,
  },
  mascotInfo: {
    flex: 1,
  },
  mascotTagRow: {
    flexDirection: 'row',
  },
  mascotTag: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#451A03',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  mascotName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  mascotTitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 6,
  },
  xpRow: {
    marginTop: 2,
  },
  xpText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  xpBarTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  speechBubble: {
    backgroundColor: '#0F172A',
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  speechHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  speechTag: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
  },
  speechText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  chatMascotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  chatMascotBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  mascotSelectorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 12,
  },
  selectorPrompt: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 10,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectorBtnActive: {
    borderColor: '#6366F1',
    backgroundColor: '#1E1B4B',
  },
  selectorEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  selectorName: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  selectorNameActive: {
    color: '#818CF8',
  },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  cardBadge: {
    backgroundColor: '#1E293B',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cutoffMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cutoffLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  cutoffBigScore: {
    color: '#38BDF8',
    fontSize: 24,
    fontWeight: '800',
  },
  cutoffTargetScore: {
    color: '#EF4444',
    fontSize: 24,
    fontWeight: '800',
  },
  gaugeTrack: {
    height: 10,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    position: 'relative',
    marginBottom: 12,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 5,
  },
  cutoffMarker: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    width: 4,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  statusAdviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
  },
  statusAdviceText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  missionsCounter: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#082F49',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  missionItemDone: {
    borderColor: '#065F46',
    backgroundColor: '#064E3B20',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  missionTextContainer: {
    flex: 1,
  },
  missionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  missionTitleDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  missionXpText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  missionActionBtn: {
    padding: 4,
    marginLeft: 6,
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  gridNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navCard: {
    width: '48%',
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  navSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
});
