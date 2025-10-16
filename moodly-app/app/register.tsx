import { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:1337';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuthData } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
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
        
        Alert.alert('Succès', 'Compte créé avec succès !', [
          {
            text: 'OK',
            onPress: () => {
              if (data.user.isManager) {
                router.replace('/admin' as any);
              } else {
                router.replace('/(tabs)');
              }
            },
          },
        ]);
      } else {
        Alert.alert('Erreur', data.error?.message || 'Impossible de créer le compte');
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
        Créer un compte
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={{
          padding: 15,
          borderRadius: 5,
        }}
      >
        <Text style={{ textAlign: 'center', color: '#007AFF' }}>
          Déjà un compte ? Se connecter
        </Text>
      </Pressable>
    </View>
  );
}
