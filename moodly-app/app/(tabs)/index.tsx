import { useState } from 'react';
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
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
 

export default function TabOneScreen() {
  const { user, logout, jwt } = useAuth();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  const handlePostMood = async () => {
    if (!selectedMood) {
      Alert.alert('Erreur', 'Veuillez sélectionner un mood');
      return;
    }

    setLoading(true);
    try {
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

      if (response.ok) {
        Alert.alert('Succès', 'Votre mood a été enregistré !');
        setSelectedMood(null);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>
            Bienvenue {user?.username} !
          </Text>
          <Text style={{ color: '#666' }}>
            Comment vous sentez-vous aujourd'hui ?
          </Text>
        </View>

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
        onPress={handlePostMood}
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
            Enregistrer mon mood
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: '#FF3B30',
          padding: 15,
          borderRadius: 10,
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
