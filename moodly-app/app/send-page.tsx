import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { FlowerMood } from '@/components/custom/FlowerMood';
import type { Emotions } from '@/types/emotions';
import { Input } from "@/components/ui/input"
import { getFlowerColor } from '@/lib/flowerColors';



export default function SummaryScreen() {
  const params = useLocalSearchParams<{ percentage: string; emotions: string }>();
  
  const percentage = params.percentage ? parseInt(params.percentage, 10) : 50;
  const emotions: Emotions = params.emotions 
    ? JSON.parse(params.emotions) 
    : {
        colere: false,
        Inquiétude: false,
        tristesse: false,
        peur: false,
        anxiete: false,
        frustration: false,
      };



  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-[#353535]">
          <View className="flex-1 justify-center items-center">
            <View className="p-5 z-20 h-36 ">
              <Input 
                placeholder="Quelque chose à ajouter ?"
                placeholderTextColor="#B7B7B7"
                className="bg-[#707070] text-[#B7B7B7] mb-4 h-96 rounded-2xl w-80 border-0 pt-3"
                textAlignVertical="top"
                multiline
              />
              
              <Button 
                className="rounded-xl w-36 self-center "
                style={{ backgroundColor: getFlowerColor(percentage) }}
              >
                <Text className='text-black'>Envoyer</Text>
              </Button>
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
