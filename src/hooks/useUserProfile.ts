import { useState, useEffect } from 'react';

export interface UserProfile {
  tasteProfile: string;
  lastUpdated: number;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('animeUserProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('animeUserProfile', JSON.stringify(profile));
  };

  const clearProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('animeUserProfile');
  };

  return { userProfile, saveProfile, clearProfile };
} 