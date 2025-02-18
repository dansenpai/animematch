import { FavoriteAnime } from '@/types/anime';

export function migrateFavorites() {
  const savedFavorites = localStorage.getItem('animeFavorites');
  
  if (savedFavorites) {
    try {
      const oldFavorites = JSON.parse(savedFavorites);
      
      // Verifica se os dados precisam ser migrados
      if (Array.isArray(oldFavorites) && oldFavorites.length > 0 && !oldFavorites[0].status) {
        // Adiciona o status 'watching' para todos os favoritos existentes
        const migratedFavorites: FavoriteAnime[] = oldFavorites.map(favorite => ({
          ...favorite,
          status: 'watching'
        }));
        
        localStorage.setItem('animeFavorites', JSON.stringify(migratedFavorites));
        console.log('Migração de favoritos concluída');
      }
    } catch (error) {
      console.error('Erro durante a migração:', error);
    }
  }
} 