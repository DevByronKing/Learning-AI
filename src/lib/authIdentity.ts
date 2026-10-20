/**
 * Identidade do usuário autenticado.
 *
 * O `useAuthStore` inicia com um usuário DEMO (`usr_default_demo`) para a UI funcionar offline.
 * Esse usuário NÃO deve ser usado para sincronizar dados com o Supabase nem para envio de e-mails.
 */
import { useAuthStore } from '@/store/useAuthStore';

export const DEMO_USER_ID = 'usr_default_demo';
export const LEGACY_DEMO_USER_ID = 'user-demo';

export function isDemoUserId(id?: string | null): boolean {
  return !id || id === DEMO_USER_ID || id === LEGACY_DEMO_USER_ID;
}

/** Retorna o usuário realmente autenticado, ou null se for apenas o usuário demo / deslogado. */
export function getRealAuthUser(): { id: string; email: string; name?: string } | null {
  try {
    const { user } = useAuthStore.getState();
    if (!user || isDemoUserId(user.id)) return null;
    return user;
  } catch {
    return null;
  }
}

/** ID do usuário real para sincronização com o backend (null = não sincronizar). */
export function getSyncUserId(): string | null {
  return getRealAuthUser()?.id ?? null;
}
