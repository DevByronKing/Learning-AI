import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MOBILE_DISTRACTORS } from '../data/mockData';

export default function DiagnosticoScreen() {
  const insets = useSafeAreaInsets();

  const subjects = [
    { name: 'Direito Constitucional', accuracy: 88, weight: 'Peso 2', status: 'Dominado', color: '#10B981' },
    { name: 'Direito Previdenciário', accuracy: 54, weight: 'Peso 3 (58% da prova)', status: 'Ponto Cego', color: '#EF4444' },
    { name: 'Direito Administrativo', accuracy: 68, weight: 'Peso 2', status: 'Instável', color: '#F59E0B' },
    { name: 'Língua Portuguesa', accuracy: 76, weight: 'Peso 1', status: 'Instável', color: '#6366F1' },
    { name: 'Raciocínio Lógico', accuracy: 82, weight: 'Peso 1', status: 'Dominado', color: '#38BDF8' },
  ];

  const errorTypes = [
    { title: 'Pegadinha da Banca', percent: 38, count: 18, desc: 'Distrator semântico ou pegadinha da banca Cebraspe/FGV', color: '#EF4444' },
    { title: 'Lacuna Teórica', percent: 28, count: 13, desc: 'Conceito doutrinário ou artigo de lei seca não revisado', color: '#F59E0B' },
    { title: 'Leitura Apressada', percent: 20, count: 9, desc: 'Desatenção ao comando (troca de "correto" por "incorreto")', color: '#6366F1' },
    { title: 'Curva de Esquecimento', percent: 14, count: 6, desc: 'Conteúdo estudado há mais de 21 dias sem ciclo SRS', color: '#8B5CF6' },
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>INTELIGÊNCIA COGNITIVA</Text>
            </View>
            <Text style={styles.headerSub}>Raio-X de Desempenho</Text>
          </View>
          <Text style={styles.screenTitle}>Diagnóstico & Métricas</Text>
        </View>

        <View style={styles.radarBadge}>
          <Ionicons name="analytics" size={18} color="#38BDF8" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card do Termômetro da Nota de Corte */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🎯 Termômetro da Aprovação</Text>
            <Text style={styles.cardTag}>INSS 2026</Text>
          </View>

          <View style={styles.cutoffRow}>
            <View>
              <Text style={styles.cutoffLabel}>Seu Rendimento</Text>
              <Text style={styles.cutoffUserScore}>68.0%</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cutoffLabel}>Nota de Corte Projetada</Text>
              <Text style={styles.cutoffTargetScore}>78.5%</Text>
            </View>
          </View>

          {/* Barra com régua */}
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: '68%' }]} />
            <View style={[styles.gaugeMarker, { left: '78.5%' }]} />
          </View>

          <View style={styles.gapAdviceBox}>
            <Ionicons name="flash" size={16} color="#F59E0B" />
            <Text style={styles.gapAdviceText}>
              Faltam apenas <Text style={{ color: '#F59E0B', fontWeight: '800' }}>10.5%</Text> para alcançar a zona de classificação direta para as vagas imediatas.
            </Text>
          </View>
        </View>

        {/* Desempenho por Disciplina */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📚 Precisão por Matéria</Text>
            <Text style={styles.cardSubtitle}>Relevância x Acertos</Text>
          </View>

          {subjects.map((s, idx) => (
            <View key={idx} style={styles.subjectRow}>
              <View style={styles.subjectTopLine}>
                <View>
                  <Text style={styles.subjectName}>{s.name}</Text>
                  <Text style={styles.subjectWeight}>{s.weight}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.subjectScore, { color: s.color }]}>{s.accuracy}%</Text>
                  <Text style={styles.subjectStatus}>{s.status}</Text>
                </View>
              </View>
              <View style={styles.subjectBarTrack}>
                <View style={[styles.subjectBarFill, { width: `${s.accuracy}%`, backgroundColor: s.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Análise dos 4 Tipos de Erro */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🔍 Os 4 Tipos de Erro da Banca</Text>
            <Text style={styles.cardSubtitle}>Total de 46 erros mapeados</Text>
          </View>

          {errorTypes.map((err, idx) => (
            <View key={idx} style={styles.errorItem}>
              <View style={styles.errorHeader}>
                <View style={[styles.errorColorIndicator, { backgroundColor: err.color }]} />
                <Text style={styles.errorTitle}>{err.title}</Text>
                <Text style={styles.errorPercent}>{err.percent}% ({err.count} questões)</Text>
              </View>
              <Text style={styles.errorDesc}>{err.desc}</Text>
              <View style={styles.errorTrack}>
                <View style={[styles.errorFill, { width: `${err.percent}%`, backgroundColor: err.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Raio-X Psicométrico: Vulnerabilidade a Distratores (TRI) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="finger-print" size={16} color="#38BDF8" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Vulnerabilidade a Distratores</Text>
            </View>
            <Text style={styles.cardTag}>TRI • CEBRASPE</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Mapeamento da sua suscetibilidade aos arquétipos mentais dos examinadores
          </Text>

          {MOCK_MOBILE_DISTRACTORS.map((dist, idx) => {
            const isHigh = dist.userVulnerability >= 60;
            const isMid = dist.userVulnerability >= 40 && dist.userVulnerability < 60;
            const barColor = isHigh ? '#EF4444' : isMid ? '#F59E0B' : '#10B981';

            return (
              <View key={idx} style={styles.distractorItem}>
                <View style={styles.distractorTopRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.distractorName}>{dist.name}</Text>
                    <Text style={styles.distractorFrequency}>
                      Frequência na banca: <Text style={{ color: '#38BDF8', fontWeight: '700' }}>{dist.frequencyCebraspe}%</Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.distractorScore, { color: barColor }]}>
                      {dist.userVulnerability}% vulnerável
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.15)' : isMid ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)' }]}>
                      <Text style={[styles.statusBadgeText, { color: barColor }]}>
                        {dist.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Barra de vulnerabilidade */}
                <View style={styles.distractorTrack}>
                  <View style={[styles.distractorFill, { width: `${dist.userVulnerability}%`, backgroundColor: barColor }]} />
                </View>

                <View style={styles.antidoteBox}>
                  <Ionicons name="shield-checkmark" size={12} color="#38BDF8" style={{ marginRight: 5 }} />
                  <Text style={styles.antidoteText}>{dist.antidote}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Recomendação da IA */}
        <View style={styles.aiRecommendationCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="bulb" size={20} color="#38BDF8" />
            <Text style={styles.aiRecommendationTitle}>Direcionamento Estratégico da IA</Text>
          </View>
          <Text style={styles.aiRecommendationText}>
            Como Direito Previdenciário corresponde a 58% do peso da prova e seu rendimento atual está em 54%, dedicar 40 minutos diários a Segurados Obrigatórios e Período de Graça adicionará +6.8% à sua nota global em menos de 10 dias.
          </Text>
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
    backgroundColor: '#0369A1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#E0F2FE',
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
  radarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
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
  cardTag: {
    backgroundColor: '#1E293B',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 11,
  },
  cutoffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cutoffLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  cutoffUserScore: {
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
    marginBottom: 14,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 5,
  },
  gaugeMarker: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    width: 4,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  gapAdviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    padding: 10,
    borderRadius: 8,
  },
  gapAdviceText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  subjectRow: {
    marginBottom: 14,
  },
  subjectTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  subjectWeight: {
    color: '#64748B',
    fontSize: 11,
  },
  subjectScore: {
    fontSize: 14,
    fontWeight: '800',
  },
  subjectStatus: {
    color: '#94A3B8',
    fontSize: 10,
  },
  subjectBarTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  errorItem: {
    marginBottom: 14,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  errorColorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  errorTitle: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  errorPercent: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  errorDesc: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 16,
  },
  errorTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  errorFill: {
    height: '100%',
    borderRadius: 3,
  },
  distractorItem: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  distractorTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  distractorName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  distractorFrequency: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  distractorScore: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  distractorTrack: {
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  distractorFill: {
    height: '100%',
    borderRadius: 3,
  },
  antidoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#082F49',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  antidoteText: {
    color: '#BAE6FD',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  aiRecommendationCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 16,
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiRecommendationTitle: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  aiRecommendationText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
});
