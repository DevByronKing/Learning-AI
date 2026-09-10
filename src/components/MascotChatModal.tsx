'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  Flame, 
  BrainCircuit, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { MascotCompanion } from '@/lib/types';
import { analytics } from '@/lib/analytics';

interface MascotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mascot: MascotCompanion;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mascot';
  text: string;
  timestamp: string;
}

export const MascotChatModal: React.FC<MascotChatModalProps> = ({
  isOpen,
  onClose,
  mascot
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts per mascot
  const getSuggestedPrompts = () => {
    switch (mascot.id) {
      case 'coruja':
        return [
          'Como identificar as pegadinhas da Cebraspe?',
          'Qual é a melhor rota 80/20 para o meu edital?',
          'Como estudar lei seca sem esquecer os detalhes?'
        ];
      case 'falcao':
        return [
          'Como resolver cada questão em menos de 2 minutos?',
          'Quais matérias têm maior peso na nota de corte?',
          'Qual é a técnica de eliminação rápida de alternativas?'
        ];
      case 'lobo':
        return [
          'Não consegui bater a meta ontem, o que fazer hoje?',
          'Como funciona a Repetição Espaçada (SRS)?',
          'Como manter o foco quando a rotina aperta?'
        ];
      case 'leao':
        return [
          'Como estruturar uma redação nota máxima na banca?',
          'Como citar a CF/88 e súmulas com precisão?',
          'Quais são os erros que mais tiram pontos na discursiva?'
        ];
      default:
        return [
          'Qual deve ser minha prioridade de estudo hoje?',
          'Como superar a curva de esquecimento?',
          'Dica rápida para a banca examinadora'
        ];
    }
  };

  // Generate tactical answers based on mascot persona
  const generateMascotResponse = (userPrompt: string): string => {
    const promptLower = userPrompt.toLowerCase();

    if (mascot.id === 'coruja') {
      if (promptLower.includes('pegadinha') || promptLower.includes('cebraspe')) {
        return '🦉 Olho vivo nas armadilhas! A Cebraspe adora usar distratores de "Generalização Indevida": desconfie imediatamente de palavras como "sempre", "nunca", "em qualquer hipótese" ou "indelegável". Se encontrar esses termos, 85% de chance de o item estar ERRADO. Busque a exceção!';
      }
      if (promptLower.includes('80/20') || promptLower.includes('edital')) {
        return '🦉 Minha visão 360° indica: não se desespere para zerar todo o edital. Em Direito Previdenciário, por exemplo, 58% das questões se concentram em Segurados Obrigatórios e Período de Graça. Domine esse núcleo e você garante a sua vaga!';
      }
      return '🦉 Sabedoria e foco! A mente humana absorve melhor em blocos de 45 minutos com 10 de pausa. Revise os distratores da banca antes de dormir para fixar no sono REM. Estou aqui guardando o seu progresso!';
    }

    if (mascot.id === 'falcao') {
      if (promptLower.includes('tempo') || promptLower.includes('minuto')) {
        return '🦅 Mira cirúrgica! Para resolver em menos de 2 minutos: leia primeiro o COMANDO da questão (a última frase antes das alternativas). Muitas vezes o texto longo inicial é apenas distração da banca. Identifique o verbo e liquide a alternativa!';
      }
      if (promptLower.includes('peso') || promptLower.includes('corte')) {
        return '🦅 Ataque de precisão: mire nas matérias de Peso 2 e 3 logo no início do dia, quando sua energia mental está em 100%. Deixar raciocínio lógico ou previdenciário para o fim do expediente derruba a nota!';
      }
      return '🦅 Velocidade é sobrevivência em concurso! Não trave em questão difícil por mais de 3 minutos: marque para revisão e siga avançando. Cada questão vale os mesmos pontos!';
    }

    if (mascot.id === 'lobo') {
      if (promptLower.includes('ontem') || promptLower.includes('meta') || promptLower.includes('desânimo')) {
        return '🐺 Sem culpa na matilha! A consistência de longo prazo vence qualquer dia isolado que deu errado. Não tente compensar 10 horas hoje se você só tem 3. Faça o seu melhor hoje e proteja o seu streak!';
      }
      if (promptLower.includes('srs') || promptLower.includes('repeti') || promptLower.includes('esquec')) {
        return '🐺 O algoritmo de Repetição Espaçada é o nosso maior escudo. Ao revisar 15 flashcards no 1º, 7º e 21º dia após o estudo, sua retenção sobe de 30% para mais de 85%. O hábito diário constrói o nome no Diário Oficial!';
      }
      return '🐺 Mantenha a guarda alta! Um guerreiro não desiste no meio do caminho. 30 minutos focados hoje valem mais do que uma semana inteira de estudo passivo. Vamos juntos nessa!';
    }

    if (mascot.id === 'leao') {
      if (promptLower.includes('redação') || promptLower.includes('discursiva')) {
        return '🦁 Postura de autoridade! Na prova discursiva, a banca busca 3 coisas: clareza na tese jurídica, citação expressa do dispositivo constitucional/legal e conclusão com proposta de solução. Nunca deixe parágrafos com períodos longos demais!';
      }
      if (promptLower.includes('cf') || promptLower.includes('súmula') || promptLower.includes('lei')) {
        return '🦁 Domínio das leis! Ao fundamentar, cite o gênero e a espécie: "conforme preceitua o Art. 5º, inciso XI da CF/88...". O examinador pontua no espelho oficial cada palavra-chave que você conecta com exatidão!';
      }
      return '🦁 O cargo público é conquistado com preparo e firmeza. Quem se prepara para a discursiva já está na frente de 90% dos candidatos. Treine uma peça por semana e a vaga será sua!';
    }

    return `✨ ${mascot.name}: Continue focado! O seu compromisso diário com a meta está construindo a sua aprovação degrau por degrau. O que mais quer desarmar hoje?`;
  };

  useEffect(() => {
    if (isOpen) {
      // Initialize chat with mascot welcome
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'mascot',
          text: `Olá, futuro(a) empossado(a)! Eu sou ${mascot.name} (${mascot.species}). Minha especialidade é: ${mascot.specialty}. Como posso te orientar hoje para garantir sua aprovação sem ansiedade?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      analytics.track('mascot_strategy_interacted', { mascotId: mascot.id, mascotName: mascot.name });
    }
  }, [isOpen, mascot]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateMascotResponse(text);
      const mascotMsg: ChatMessage = {
        id: `msc-${Date.now()}`,
        sender: 'mascot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mascotMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header do Copiloto */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-3xl shadow-inner">
              {mascot.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{mascot.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold text-indigo-300">
                  {mascot.species}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                {mascot.specialty}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-950/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-base shrink-0 self-end mb-1">
                    {mascot.avatarEmoji}
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-base shrink-0 self-end mb-1">
                {mascot.avatarEmoji}
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões Rápidas de Perguntas */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Sugestões:
          </span>
          {getSuggestedPrompts().map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Campo de Digitação */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Pergunte algo para ${mascot.name} sobre edital, prazos ou pegadinhas...`}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
