import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Pressable, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';

import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:1337';

const MOODS = [
  { value: 'happy', label: 'Heureux 😊', color: '#4CAF50' },
  { value: 'sad', label: 'Triste 😢', color: '#2196F3' },
  { value: 'angry', label: 'En colère 😠', color: '#F44336' },
  { value: 'excited', label: 'Excité 🤩', color: '#FF9800' },
  { value: 'tired', label: 'Fatigué 😴', color: '#9E9E9E' },
  { value: 'stressed', label: 'Stressé 😰', color: '#9C27B0' },
  { value: 'calm', label: 'Calme 😌', color: '#00BCD4' },
];

interface TodayMood {
  id: number;
  documentId: string;
  User: string;
  Mood: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default function TabOneScreen() {
  const { user, logout, jwt } = useAuth();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingMood, setCheckingMood] = useState(true);
  const [todayMood, setTodayMood] = useState<TodayMood | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  // Vérifier si l'utilisateur a déjà posté un mood aujourd'hui
  const checkTodayMood = async () => {
    setCheckingMood(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = `${API_URL}/api/moods?filters[User][$eq]=${user?.username}&filters[createdAt][$gte]=${today}T00:00:00.000Z&filters[createdAt][$lte]=${today}T23:59:59.999Z&sort=createdAt:desc`;
      console.log('Checking mood with URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      const data = await response.json();
      console.log('Mood check response:', JSON.stringify(data, null, 2));

      if (response.ok && data.data && data.data.length > 0) {
        // Trier par date de création décroissante pour avoir le plus récent
        const sortedMoods = data.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const mood = sortedMoods[0];
        if (mood && mood.Mood) {
          setTodayMood(mood);
          setSelectedMood(mood.Mood);
          console.log('Found today mood:', mood.Mood);
        } else {
          setTodayMood(null);
          console.log('No valid mood data');
        }
      } else {
        setTodayMood(null);
        console.log('No mood found for today');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mood:', error);
      setTodayMood(null);
    } finally {
      setCheckingMood(false);
    }
  };

  useEffect(() => {
    if (user && jwt) {
      checkTodayMood();
    }
  }, [user, jwt]);

  const handlePostMood = async () => {
    if (!selectedMood) {
      Alert.alert('Erreur', 'Veuillez sélectionner un mood');
      return;
    }

    setLoading(true);
    try {
      console.log('Posting mood:', selectedMood, 'for user:', user?.username);
      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            User: user?.username,
            Mood: selectedMood,
          },
        }),
      });

      const data = await response.json();
      console.log('Post mood response:', JSON.stringify(data, null, 2));

      if (response.ok) {
        Alert.alert('Succès', 'Votre mood a été enregistré !');
        // Attendre un peu avant de recharger pour s'assurer que l'API a bien enregistré
        setTimeout(() => {
          checkTodayMood();
        }, 500);
      } else {
        Alert.alert('Erreur', data.error?.message || 'Impossible d\'enregistrer le mood');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMood = async () => {
    if (!selectedMood || !todayMood) {
      Alert.alert('Erreur', 'Veuillez sélectionner un mood');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/moods/${todayMood.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            Mood: selectedMood,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Votre mood a été mis à jour !');
        setIsEditing(false);
        setTimeout(() => {
          checkTodayMood();
        }, 800);
      } else {
        Alert.alert('Erreur', data.error?.message || 'Impossible de modifier le mood');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMood = async () => {
    if (!todayMood) return;

    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer votre mood ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${API_URL}/api/moods/${todayMood.documentId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${jwt}`,
                },
              });

              if (response.ok) {
                Alert.alert('Succès', 'Votre mood a été supprimé !');
                setTodayMood(null);
                setSelectedMood(null);
                setIsEditing(false);
              } else {
                Alert.alert('Erreur', 'Impossible de supprimer le mood');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se connecter au serveur');
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>
            Bienvenue {user?.username} !
          </Text>
          <Text style={{ color: '#666' }}>
            {todayMood && !isEditing 
              ? 'Votre mood du jour' 
              : 'Comment vous sentez-vous aujourd\'hui ?'}
          </Text>
        </View>

        {checkingMood ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10, color: '#666' }}>Chargement...</Text>
          </View>
        ) : todayMood && !isEditing ? (
          // Affichage du mood existant
          <View>
            <View style={{ 
              backgroundColor: 'white', 
              padding: 20, 
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
                Vous vous sentez :
              </Text>
              <Text style={{ 
                fontSize: 32, 
                fontWeight: 'bold',
                color: MOODS.find(m => m.value === todayMood?.Mood)?.color || '#000',
                textAlign: 'center',
                marginVertical: 10,
              }}>
                {MOODS.find(m => m.value === todayMood?.Mood)?.label || todayMood?.Mood || 'N/A'}
              </Text>
            </View>

            <Pressable
              onPress={() => setIsEditing(true)}
              style={{
                backgroundColor: '#007AFF',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                Modifier mon mood
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDeleteMood}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#FF3B30',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Supprimer mon mood
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          // Sélection/Modification du mood
          <View>
            <View style={{ marginBottom: 20 }}>
              {MOODS.map((mood) => (
                <Pressable
                  key={mood.value}
                  onPress={() => setSelectedMood(mood.value)}
                  style={{
                    backgroundColor: selectedMood === mood.value ? mood.color : 'white',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: mood.color,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: selectedMood === mood.value ? 'white' : mood.color,
                      textAlign: 'center',
                    }}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={isEditing ? handleUpdateMood : handlePostMood}
              disabled={loading || !selectedMood}
              style={{
                backgroundColor: selectedMood && !loading ? '#007AFF' : '#ccc',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  {isEditing ? 'Mettre à jour mon mood' : 'Enregistrer mon mood'}
                </Text>
              )}
            </Pressable>

            {isEditing && (
              <Pressable
                onPress={() => {
                  setIsEditing(false);
                  setSelectedMood(todayMood?.Mood || null);
                }}
                style={{
                  backgroundColor: '#666',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Annuler
                </Text>
              </Pressable>
            )}
          </View>
        )}

        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: '#FF3B30',
            padding: 15,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            Se déconnecter
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
