import { supabaseServer } from './supabaseServer';
import { supabase } from './supabaseClient';

export async function fetchUserByUrl(url: string) {
  return supabaseServer
    .from('users')
    .select('id, name, intro, email, phone, image, github, insta, velog, auth_user_id')
    .eq('url', url)
    .single();
}

export async function fetchUserHistory(userId: number) {
  return supabaseServer
    .from('history')
    .select('area, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function fetchUserProfileForEdit(url: string) {
  return supabase
    .from('users')
    .select('id, auth_user_id, name, intro, email, image, github, insta, velog, phone')
    .eq('url', url)
    .single();
}

export async function fetchHistoryForEdit(userId: number) {
  return supabase
    .from('history')
    .select('area, content')
    .eq('user_id', userId);
}
