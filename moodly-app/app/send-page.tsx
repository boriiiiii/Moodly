import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { FlowerMood } from '@/components/custom/FlowerMood';
import { MoodButton } from '@/components/custom/MoodButton';
import { Input } from "@/components/ui/input";


export default function SummaryScreen() {
  const params = useLocalSearchParams<{ percentage: string; emotions: string }>();
  const percentage = params.percentage ? parseInt(params.percentage, 10) : 50;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-[#353535]">
          <View className="flex-1 justify-center items-center">
            <View className="p-5 z-20 h-36 ">
              <Input 
                placeholder="Quelque chose à ajouter ?"
                className="bg-[#707070] text-[#B7B7B7] placeholder:text-[#B7B7B7] mb-4 h-96 rounded-2xl w-80 border-0 pt-3"
                textAlignVertical="top"
                multiline
              />
              
              <MoodButton 
                percentage={percentage}
                label="Envoyer"
                className="w-36 self-center"
                onPress={() => router.push({
                  pathname: '/thanks-page',
                  params: {
                    percentage: percentage.toString(),
                  }
                })}
              />
            </View>
          </View>
          
          <FlowerMood 
            percentage={percentage} 
            position="top-right"
            size={550}
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
