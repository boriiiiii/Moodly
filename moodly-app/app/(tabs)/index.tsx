import { Text, View, Pressable } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-900">Bienvenue {user?.username} !</Text>
      <View className="my-8 h-px w-4/5 bg-gray-200" />
      <Text className="text-center text-gray-600 mx-12">
        Votre app pour suivre votre humeur.
      </Text>
      
      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: '#FF3B30',
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
}
