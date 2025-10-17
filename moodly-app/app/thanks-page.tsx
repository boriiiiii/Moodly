import { FlowerMood } from '@/components/custom/FlowerMood';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import type { Emotions } from '@/types/emotions';



export default function ThanksPage() {
    const params = useLocalSearchParams<{ percentage: string }>();
    const percentage = params.percentage ? parseInt(params.percentage, 10) : 50;



    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-[#353535]">
                <View> 

            <Text className="text-white text-3xl mt-12 px-5">
                Merci pour ton retour ! 
            </Text>
            <Text className="text-white text-lg px-5 mt-5">
                Reste sur ta lancée, cette journée n’attend que toi.
            </Text>
            </View>
            <View>
                <Text className="text-white text-2xl px-5 mt-5  text-center"> 
                6🔥
                </Text>
            <Text className="text-white text-2xl px-5   text-center"> 
                Tu viens de compléter ta série. {'\n'}
                Bien joué, à demain !            
            </Text>
            </View>
            <FlowerMood 
            percentage={percentage} 
            position="middle"
            size={480}
          />
            </View>

        </>
    );
}
