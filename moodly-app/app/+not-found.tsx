import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Cette page n'existe pas.
        </Text>

        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-blue-600">
            Retourner à l'accueil
          </Text>
        </Link>
      </View>
    </>
  );
}
