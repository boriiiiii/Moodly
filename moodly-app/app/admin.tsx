import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:1337';

interface Mood {
  id: number;
  documentId: string;
  User: string;
  Mood: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default function AdminScreen() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const { jwt, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await fetch(`${API_URL}/api/moods`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        setMoods(result.data || []);
      } else {
        console.error('Erreur lors de la récupération des moods');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'excited': '🤩',
      'tired': '😴',
      'stressed': '😰',
      'calm': '😌',
    };
    return emojis[mood.toLowerCase()] || '😐';
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Admin - Moods ({moods.length})
        </Text>
        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: '#FF3B30',
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Déconnexion
          </Text>
        </Pressable>
      </View>

      <Text style={{ marginBottom: 10, color: '#666', paddingHorizontal: 20 }}>
        Connecté en tant que : {user?.username} (Manager)
      </Text>

      <FlatList
        data={moods}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        keyExtractor={(item) => item.documentId}
        refreshing={loading}
        onRefresh={fetchMoods}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>
            Aucun mood enregistré
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                  {getMoodEmoji(item.Mood)} {item.Mood}
                </Text>
                <Text style={{ color: '#666', marginBottom: 5 }}>
                  Utilisateur: {item.User}
                </Text>
                <Text style={{ color: '#999', fontSize: 12 }}>
                  {new Date(item.createdAt).toLocaleString('fr-FR')}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
