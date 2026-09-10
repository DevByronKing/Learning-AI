import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MobilePaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MobilePaywallModal: React.FC<MobilePaywallModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [pixCopied, setPixCopied] = useState(false);

  const pixCode = '00020126580014br.gov.bcb.pix0136aprovalens-pro-pix-vip-20265204000053039865802BR5925APROVALENS SAAS LTDA6009SAO PAULO62070503***6304E8A2';

  const handleCopyPix = () => {
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
    Alert.alert('Código Pix Copiado!', 'Cole no aplicativo do seu banco para concluir o pagamento instantâneo.');
  };

  const handleConfirmSimulated = () => {
    Alert.alert(
      '🎉 Acesso Pro Ativado!',
      'Parabéns! Sua assinatura do Plano Gabarito Pro foi ativada. Você agora tem acesso ilimitado à Psicometria e Simulados.',
      [
        {
          text: 'Bora Estudar!',
          onPress: () => {
            onSuccess();
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.proPill}>
              <Ionicons name="sparkles" size={14} color="#FBBF24" />
              <Text style={styles.proPillText}>APROVALENS VIP</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Title & Subtitle */}
            <Text style={styles.mainTitle}>Desbloqueie o Copiloto de Alta Performance</Text>
            <Text style={styles.subTitle}>
              Acesso ilimitado ao Laboratório de Psicometria TRI, simulados infinitos e correção preditiva.
            </Text>

            {/* Selector de Ciclo (Anual vs Mensal) */}
            <View style={styles.cycleSelector}>
              <TouchableOpacity
                style={[styles.cycleBtn, billingCycle === 'annual' && styles.cycleBtnActive]}
                onPress={() => setBillingCycle('annual')}
                activeOpacity={0.8}
              >
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-40% OFF</Text>
                </View>
                <Text style={[styles.cycleBtnTitle, billingCycle === 'annual' && styles.cycleBtnTitleActive]}>
                  Anual no Pix
                </Text>
                <Text style={styles.cycleBtnPrice}>R$ 41,41 / mês</Text>
                <Text style={styles.cycleBtnTotal}>R$ 497 à vista</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cycleBtn, billingCycle === 'monthly' && styles.cycleBtnActive]}
                onPress={() => setBillingCycle('monthly')}
                activeOpacity={0.8}
              >
                <Text style={[styles.cycleBtnTitle, billingCycle === 'monthly' && styles.cycleBtnTitleActive]}>
                  Mensal
                </Text>
                <Text style={styles.cycleBtnPrice}>R$ 69,90 / mês</Text>
                <Text style={styles.cycleBtnTotal}>Sem fidelidade</Text>
              </TouchableOpacity>
            </View>

            {/* Benefícios Inclusos */}
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsHeader}>O QUE ESTÁ INCLUÍDO NO PLANO PRO:</Text>
              
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Psicometria das Bancas:</Text> Raio-X de distratores e pegadinhas Cebraspe, FGV e FCC.
                </Text>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Simulados Ilimitados:</Text> Diagnóstico imediato dos 4 tipos de erro.
                </Text>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Flashcards SRS:</Text> Algoritmo inteligente de repetição espaçada no bolso.
                </Text>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>Sincronização Nuvem:</Text> Continue no PC ou no Celular sem perder o progresso.
                </Text>
              </View>
            </View>

            {/* Pix Box */}
            <View style={styles.pixCard}>
              <View style={styles.pixHeader}>
                <Ionicons name="flash" size={16} color="#38BDF8" />
                <Text style={styles.pixTitle}>PAGAMENTO INSTANTÂNEO VIA PIX</Text>
              </View>
              <Text style={styles.pixDesc}>Liberação imediata da sua conta em menos de 10 segundos.</Text>
              
              <View style={styles.pixCodeBox}>
                <Text style={styles.pixCodeText} numberOfLines={1}>{pixCode}</Text>
              </View>

              <TouchableOpacity
                style={styles.copyPixBtn}
                onPress={handleCopyPix}
                activeOpacity={0.8}
              >
                <Ionicons name={pixCopied ? "checkmark" : "copy-outline"} size={18} color="#FFFFFF" />
                <Text style={styles.copyPixBtnText}>
                  {pixCopied ? 'Chave Pix Copiada!' : 'Copiar Chave Pix'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Ativação / Confirmação */}
            <TouchableOpacity
              style={styles.activateBtn}
              onPress={handleConfirmSimulated}
              activeOpacity={0.8}
            >
              <Text style={styles.activateBtnText}>Confirmar Pagamento</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.guaranteeText}>
              🛡️ Garantia incondicional de 7 dias com reembolso total sem perguntas.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.88)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#4F46E5',
    maxHeight: '92%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  proPillText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  subTitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
    marginBottom: 20,
  },
  cycleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cycleBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 14,
    position: 'relative',
  },
  cycleBtnActive: {
    borderColor: '#6366F1',
    backgroundColor: '#1E1B4B',
  },
  discountBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  cycleBtnTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  cycleBtnTitleActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cycleBtnPrice: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  cycleBtnTotal: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  benefitsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  benefitsHeader: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  pixCard: {
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#0284C7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  pixHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pixTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
  },
  pixDesc: {
    color: '#BAE6FD',
    fontSize: 12,
    marginBottom: 12,
  },
  pixCodeBox: {
    backgroundColor: '#0B1929',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0369A1',
    marginBottom: 10,
  },
  pixCodeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyPixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 10,
  },
  copyPixBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  activateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  activateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  guaranteeText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 30,
  },
});
