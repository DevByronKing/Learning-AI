import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mascot } from '../data/mockData';

interface MascotChatModalProps {
  visible: boolean;
  onClose: () => void;
  mascot: Mascot;
}

interface Message {
  id: string;
  sender: 'user' | 'mascot';
  text: string;
  timestamp: string;
}

export const MascotChatModal: React.FC<MascotChatModalProps> = ({
  visible,
  onClose,
  mascot
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const getPrompts = () => {
    switch (mascot.id) {
      case 'coruja':
        return [
          'Como identificar as pegadinhas da Cebraspe?',
          'O que focar nos 80/20 do edital?',
          'Como estudar lei seca sem cansar?'
        ];
      case 'falcao':
        return [
          'Como resolver questão em 2 minutos?',
          'Quais matérias têm maior peso?',
          'Como eliminar alternativas rápido?'
        ];
      case 'lobo':
        return [
          'Perdi a meta ontem, e agora?',
          'Como funciona a Repetição Espaçada?',
          'Como manter o ritmo em dias difíceis?'
        ];
      case 'leao':
        return [
          'Como gabaritar a prova discursiva?',
          'Como citar artigos e súmulas?',
          'Qual estrutura a banca prefere?'
        ];
      default:
        return ['Dica rápida para hoje', 'Como revisar melhor'];
    }
  };

  const generateReply = (text: string) => {
    const t = text.toLowerCase();
    if (mascot.id === 'coruja') {
      if (t.includes('pegadinha') || t.includes('cebraspe')) {
        return '🦉 Olho vivo! A Cebraspe adora generalizações: desconfie de "sempre", "nunca", "em qualquer hipótese" ou "indelegável". 85% de chance de o item estar errado. Procure a exceção!';
      }
      return '🦉 Foco no núcleo! 20% do conteúdo responde por 80% das questões da prova. Domine Segurados Obrigatórios e Atos Administrativos antes de se preocupar com picuinhas!';
    }
    if (mascot.id === 'falcao') {
      if (t.includes('tempo') || t.includes('minuto')) {
        return '🦅 Mira cirúrgica! Leia direto o COMANDO antes do enunciado longo. Muitas vezes a resposta está na interpretação da última oração!';
      }
      return '🦅 Rapidez é pontuação! Se travar por mais de 2 minutos, marque para revisão e avance. Não deixe questões fáceis no final da prova sem tempo de resposta!';
    }
    if (mascot.id === 'lobo') {
      if (t.includes('ontem') || t.includes('meta')) {
        return '🐺 Sem culpa na matilha! Um dia ruim não apaga 14 dias de consistência. O importante é abrir os flashcards hoje e proteger seu streak!';
      }
      return '🐺 Constância vence genialidade! Revise seus flashcards diários: é a curva de Ebbinghaus trabalhando a seu favor enquanto você dorme!';
    }
    if (mascot.id === 'leao') {
      if (t.includes('redação') || t.includes('discursiva')) {
        return '🦁 Postura de autoridade! Três pilares obrigatórios: tese clara no primeiro parágrafo, citação expressa da CF/88 no desenvolvimento e proposta resolutiva na conclusão.';
      }
      return '🦁 O cargo é de quem tem fundamentação jurídica sólida. Use termos técnicos precisos e fuja do senso comum em peças práticas!';
    }
    return `✨ ${mascot.name}: Continue focado! O seu esforço de hoje é o seu salário de amanhã. Vamos juntos nessa jornada!`;
  };

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          id: 'welcome',
          sender: 'mascot',
          text: `Olá! Eu sou ${mascot.name} (${mascot.species}). Minha missão é te guiar em: ${mascot.specialty}. Qual é a sua dúvida ou estratégia para hoje?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [visible, mascot]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(q);
      const mascotMsg: Message = {
        id: `msc-${Date.now()}`,
        sender: 'mascot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mascotMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{mascot.emoji}</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.mascotName}>{mascot.name}</Text>
                  <View style={styles.speciesBadge}>
                    <Text style={styles.speciesText}>{mascot.species}</Text>
                  </View>
                </View>
                <Text style={styles.specialtyText} numberOfLines={1}>{mascot.specialty}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Chat Stream */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.msgWrapper,
                    isUser ? styles.msgWrapperUser : styles.msgWrapperMascot
                  ]}
                >
                  {!isUser && (
                    <Text style={styles.msgAvatar}>{mascot.emoji}</Text>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleMascot
                    ]}
                  >
                    <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextMascot]}>
                      {msg.text}
                    </Text>
                    <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampMascot]}>
                      {msg.timestamp}
                    </Text>
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.msgWrapper, styles.msgWrapperMascot]}>
                <Text style={styles.msgAvatar}>{mascot.emoji}</Text>
                <View style={[styles.bubble, styles.bubbleMascot, { paddingVertical: 10 }]}>
                  <Text style={{ color: '#818CF8', fontSize: 12, fontWeight: '700' }}>
                    {mascot.name} está analisando...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Sugestões de Perguntas Rápidas */}
          <View style={styles.promptBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptScroll}>
              {getPrompts().map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSend(p)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder={`Pergunte algo a ${mascot.name}...`}
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={() => handleSend()}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#312E81',
    maxHeight: '85%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1B4B',
    borderWidth: 1.5,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mascotName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
  },
  speciesBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speciesText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '800',
  },
  specialtyText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    padding: 16,
    gap: 12,
  },
  msgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgWrapperUser: {
    justifyContent: 'flex-end',
  },
  msgWrapperMascot: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    fontSize: 18,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  bubbleMascot: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bubbleTextMascot: {
    color: '#E2E8F0',
  },
  timestamp: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'right',
  },
  timestampUser: {
    color: '#C7D2FE',
  },
  timestampMascot: {
    color: '#64748B',
  },
  promptBar: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#090D16',
  },
  promptScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  promptChipText: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: '#6366F1',
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
});
