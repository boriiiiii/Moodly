import { Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-900">Tab One</Text>
      <View className="my-8 h-px w-4/5 bg-gray-200" />
      <Text className="text-center text-gray-600 mx-12">
        Bienvenue sur Moodly ! Votre app pour suivre votre humeur.
      </Text>
    </View>
  );
}
