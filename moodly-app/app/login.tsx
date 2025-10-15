import { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:1337';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuthData } = useAuth();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder le token JWT
        await AsyncStorage.setItem('jwt', data.jwt);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        // Mettre à jour le contexte
        setAuthData(data.jwt, data.user);
        
        // Rediriger vers l'app
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', data.error?.message || 'Identifiants incorrects');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
        Login
      </Text>

      <TextInput
        placeholder="Username ou Email"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/register' as any)}
        style={{
          padding: 15,
          borderRadius: 5,
        }}
      >
        <Text style={{ textAlign: 'center', color: '#007AFF' }}>
          Pas de compte ? S'inscrire
        </Text>
      </Pressable>
    </View>
  );
}
