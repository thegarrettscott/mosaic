import { supabase } from './supabase';

export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return {
      id: user.id,
      userId: user.id, // For backward compatibility
      email: user.email,
      freestyleIdentity: user.email, // Use email as freestyle identity for now
      // Add any other user properties you need
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id || null;
}
