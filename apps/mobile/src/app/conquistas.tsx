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
import { MOCK_ACHIEVEMENTS, MobileAchievement } from '../data/mockData';

export default function ConquistasScreen() {
  const insets = useSafeAreaInsets();
  const [filterTier, setFilterTier] = useState<string>('todos');

  const filteredAchievements = filterTier === 'todos' 
    ? MOCK_ACHIEVEMENTS 
    : MOCK_ACHIEVEMENTS.filter(a => a.tier === filterTier);

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return { border: '#06B6D4', bg: '#083344', badge: '#22D3EE', text: '#CFFAFE' };
      case 'gold':
        return { border: '#F59E0B', bg: '#451A03', badge: '#FBBF24', text: '#FEF3C7' };
      case 'silver':
        return { border: '#94A3B8', bg: '#1E293B', badge: '#CBD5E1', text: '#F1F5F9' };
      default:
        return { border: '#B45309', bg: '#291405', badge: '#D97706', text: '#FED7AA' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SISTEMA DE GAMIFICAÇÃO</Text>
            </View>
            <Text style={styles.headerSub}>Mural Oficial de Troféus</Text>
          </View>
          <Text style={styles.screenTitle}>Conquistas & Nível</Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>Nv. 4</Text>
          <Text style={styles.levelLabel}>Concurseiro</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card do Nível e XP */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.trophyIconBox}>
              <Ionicons name="trophy" size={28} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.levelHeaderLine}>
                <Text style={styles.levelTitle}>Nível 4 • Aspirante a Oficial</Text>
                <Text style={styles.xpText}>2.450 / 3.000 XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${(2450 / 3000) * 100}%` }]} />
              </View>
              <Text style={styles.xpRemainingText}>Faltam 550 XP para o Nível 5 (Técnico de Elite)</Text>
            </View>
          </View>
        </View>

        {/* Filtros de Tier */}
        <View style={styles.filtersRow}>
          {['todos', 'diamond', 'gold', 'silver', 'bronze'].map((tier) => {
            const isActive = filterTier === tier;
            return (
              <TouchableOpacity
                key={tier}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilterTier(tier)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {tier === 'todos' ? 'Todas' : tier.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista de Conquistas */}
        <View style={styles.achievementsList}>
          {filteredAchievements.map((ach) => {
            const colors = getTierColors(ach.tier);

            return (
              <View 
                key={ach.id} 
                style={[
                  styles.achievementCard, 
                  { borderColor: ach.unlocked ? colors.border : '#1F2937' },
                  ach.unlocked && { backgroundColor: '#0F172A' }
                ]}
              >
                <View style={styles.achHeaderRow}>
                  <View style={[styles.iconBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                    <Ionicons 
                      name={(ach.icon as any) || 'star'} 
                      size={24} 
                      color={ach.unlocked ? colors.badge : '#64748B'} 
                    />
                  </View>

                  <View style={styles.achDetails}>
                    <View style={styles.achTopRow}>
                      <View style={[styles.tierTag, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.tierTagText, { color: colors.badge }]}>
                          {ach.tier.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.xpRewardText}>+{ach.xp} XP</Text>
                    </View>

                    <Text style={styles.achTitle}>{ach.title}</Text>
                    <Text style={styles.achDesc}>{ach.description}</Text>

                    {/* Barra de Progresso ou Badge de Concluído */}
                    {ach.unlocked ? (
                      <View style={styles.unlockedRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.unlockedText}>Desbloqueado em {ach.unlockedAt}</Text>
                      </View>
                    ) : (
                      <View style={styles.progressSection}>
                        <View style={styles.progressRow}>
                          <Text style={styles.progressNumbers}>
                            {ach.current} de {ach.target} {ach.unit}
                          </Text>
                          <Text style={styles.progressPercent}>{ach.progress}%</Text>
                        </View>
                        <View style={styles.progressBarTrack}>
                          <View style={[styles.progressBarFill, { width: `${ach.progress}%`, backgroundColor: colors.border }]} />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
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
    backgroundColor: '#78350F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
  },
  headerSub: {
    color: '#64748B',
    fontSize: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelNumber: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '800',
  },
  levelLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  levelCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#451A03',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  xpText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  xpTrack: {
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  xpRemainingText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#6366F1',
  },
  filterText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  achievementsList: {},
  achievementCard: {
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  achHeaderRow: {
    flexDirection: 'row',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  achDetails: {
    flex: 1,
  },
  achTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  xpRewardText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  achTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  achDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  unlockedText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  progressSection: {
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressNumbers: {
    color: '#64748B',
    fontSize: 11,
  },
  progressPercent: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
