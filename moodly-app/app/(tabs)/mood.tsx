import { View } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import Animated, {useAnimatedScrollHandler,useSharedValue,runOnJS,} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { EmotionToggle } from '@/components/custom/EmotionToggle';
import { FlowerMood } from '@/components/custom/FlowerMood';
import { MoodButton } from '@/components/custom/MoodButton';
import type { Emotions } from '@/types/emotions';

export default function TabTwoScreen() {
  const scrollY = useSharedValue(0);
  const [percentage, setPercentage] = useState<number>(50);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [isLayoutReady, setIsLayoutReady] = useState<boolean>(false);
  const [emotions, setEmotions] = useState<Emotions>({
    colere: false,
    Inquiétude: false,
    tristesse: false,
    peur: false,
    anxiete: false,
    frustration: false,
  });

  const SCROLL_RANGE = 400; // pixels to scroll from 0% to 100% (lower value = more sensitive)
  const INITIAL_SCROLL = SCROLL_RANGE / 2; // Start at 50%

  // Initialize scroll position to 50% after layout is ready
  const handleLayout = (): void => {
    if (!isLayoutReady) {
      setIsLayoutReady(true);
      // Scroll to initial position immediately after layout
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: INITIAL_SCROLL,
          animated: false,
        });
      });
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const scrollPosition = event.contentOffset.y;
      scrollY.value = scrollPosition;
      
      // Calculate percentage based on scroll position
      const percent = Math.round((scrollPosition / SCROLL_RANGE) * 100);
      const clampedPercent = Math.max(0, Math.min(100, percent));
      
      // Update state on UI thread
      runOnJS(setPercentage)(clampedPercent);
    },
  });

  return (
    <View className="flex-1 bg-[#353535]">
      <View className="mt-16 ml-5">
        <Text className="text-xl text-white">
          Salut <Text className="text-xl font-bold text-white">Alphonse</Text> !
        </Text>
        <Text className="text-lg text-white">
          Nous sommes le <Text className="font-bold text-white">mardi 14 octobre</Text>{'\n'}
          Quelle est ton humeur aujourd'hui ?
        </Text>
      </View>
      <View className='mt-2 flex-row gap-3 mr-10 justify-end'> 
        <MoodButton 
          percentage={percentage}
          label="Suivant"
          onPress={() => router.push({
            pathname: '/send-page',
            params: { 
              percentage: percentage.toString(),
              emotions: JSON.stringify(emotions)
            }
          })}
        />
      </View>
      <View>
        <Text className='text-white ml-5'>Tes ressentis</Text>
      </View>
      <View className='mt-2 flex-row flex-wrap gap-3 ml-5 mr-5'>
        <EmotionToggle 
          label="Colère"
          isPressed={emotions.colere}
          onPress={() => setEmotions({...emotions, colere: !emotions.colere})}
        />
        
        <EmotionToggle 
          label="Inquiétude"
          isPressed={emotions.Inquiétude}
          onPress={() => setEmotions({...emotions, Inquiétude: !emotions.Inquiétude})}
        />
        
        <EmotionToggle 
          label="Tristesse"
          isPressed={emotions.tristesse}
          onPress={() => setEmotions({...emotions, tristesse: !emotions.tristesse})}
        />
        
        <EmotionToggle 
          label="Peur"
          isPressed={emotions.peur}
          onPress={() => setEmotions({...emotions, peur: !emotions.peur})}
        />
        
        <EmotionToggle 
          label="Anxiété"
          isPressed={emotions.anxiete}
          onPress={() => setEmotions({...emotions, anxiete: !emotions.anxiete})}
        />
        
        <EmotionToggle 
          label="Frustration"
          isPressed={emotions.frustration}
          onPress={() => setEmotions({...emotions, frustration: !emotions.frustration})}
        />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        onLayout={handleLayout}
        scrollEventThrottle={16} // ~60fps
        showsVerticalScrollIndicator={false} // hide scrollbar
        bounces={false} // Disable bounce effect
        className="flex-1"
      >
        {/* Top spacer - scroll down to decrease percentage */}
        <View style={{ height: SCROLL_RANGE }} />
        {/* Middle marker */}
        <View style={{ height: SCROLL_RANGE }} />
        {/* Bottom spacer - scroll up to increase percentage */}
        <View style={{ height: SCROLL_RANGE }} />
      </Animated.ScrollView>

      <View className="absolute inset-0 justify-center ml-5 mt-14 pointer-events-none z-10">
        <Text className="text-9xl font-bold text-white">
          {percentage}%
        </Text>
      </View>

      <FlowerMood percentage={percentage} />
    </View>
  );
}
