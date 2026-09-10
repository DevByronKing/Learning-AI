import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Esconder a splash screen suavemente após carregar os assets
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignora se já tiver sumido
      }
    };
    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0F172A',
            borderTopColor: '#1E293B',
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Jornada',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "compass" : "compass-outline"} 
                size={22} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="simulado"
          options={{
            title: 'Simulado',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "document-text" : "document-text-outline"} 
                size={22} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="flashcards"
          options={{
            title: 'Flashcards',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "bulb" : "bulb-outline"} 
                size={22} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="conquistas"
          options={{
            title: 'Conquistas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "trophy" : "trophy-outline"} 
                size={22} 
                color={color} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="diagnostico"
          options={{
            title: 'Diagnóstico',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "bar-chart" : "bar-chart-outline"} 
                size={22} 
                color={color} 
              />
            ),
          }}
        />

        {/* Ocultar página boilerplate da barra inferior */}
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
