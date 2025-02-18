interface AnimeDetails {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  averageScore: number;
  streamingEpisodes: {
    site: string;
    url: string;
  }[];
  externalLinks: {
    site: string;
    url: string;
  }[];
}

export async function getAnimeDetails(title: string): Promise<AnimeDetails | null> {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        averageScore
        streamingEpisodes {
          site
          url
        }
        externalLinks {
          site
          url
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { search: title }
      })
    });

    const data = await response.json();
    return data.data.Media;
  } catch (error) {
    console.error('Erro ao buscar detalhes do anime:', error);
    return null;
  }
}

export function getStreamingInfo(details: AnimeDetails | null) {
  if (!details) return [];

  const allLinks = [
    ...(details.streamingEpisodes || []),
    ...(details.externalLinks || [])
  ];

  const streamingServices = {
    netflix: {
      name: 'Netflix',
      icon: '🔴',
      pattern: /netflix/i
    },
    crunchyroll: {
      name: 'Crunchyroll',
      icon: '🟠',
      pattern: /crunchyroll/i
    },
    'prime-video': {
      name: 'Prime Video',
      icon: '🔵',
      pattern: /prime|amazon/i
    },
    hidive: {
      name: 'HIDIVE',
      icon: '🟢',
      pattern: /hidive/i
    },
    hulu: {
      name: 'Hulu',
      icon: '🟣',
      pattern: /hulu/i
    }
  };

  const uniqueServices = new Map();

  allLinks.forEach(link => {
    for (const [key, service] of Object.entries(streamingServices)) {
      if (service.pattern.test(link.site) || service.pattern.test(link.url)) {
        uniqueServices.set(service.name, {
          name: service.name,
          icon: service.icon,
          url: link.url
        });
      }
    }
  });

  return Array.from(uniqueServices.values());
}

export async function findClosestAnime(searchTitle: string): Promise<{ title: string; id: number } | null> {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { search: searchTitle }
      })
    });

    const data = await response.json();
    const anime = data.data.Media;

    if (!anime) return null;

    return {
      title: anime.title.english || anime.title.romaji,
      id: anime.id
    };
  } catch (error) {
    console.error('Erro ao buscar anime:', error);
    return null;
  }
} 