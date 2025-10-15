import { Text, View, Image } from 'react-native';
import { useState } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

export default function TabTwoScreen() {
  const scrollY = useSharedValue(0);
  const [percentage, setPercentage] = useState(50);

  // Total scroll range 
  // Lower value = more sensitive
  const SCROLL_RANGE = 1000; // pixels to scroll from 0% to 100%
  const INITIAL_SCROLL = SCROLL_RANGE / 2; // Start at 50%

  // Function to determine which flower image to show based on percentage
  const getFlowerImage = (percent: number) => {
    if (percent >= 100) return require('../../assets/images/flower-7.png');
    if (percent >= 85) return require('../../assets/images/flower-6.png');
    if (percent >= 70) return require('../../assets/images/flower-5.png');
    if (percent >= 50) return require('../../assets/images/flower-4.png');
    if (percent >= 30) return require('../../assets/images/flower-3.png');
    if (percent >= 15) return require('../../assets/images/flower-2.png');
    return require('../../assets/images/flower-1.png');
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      
      // Calculate percentage (0-100)
      const percent = Math.round((event.contentOffset.y / SCROLL_RANGE) * 100);
      const clampedPercent = Math.max(0, Math.min(100, percent)); // ensure value stay between 0-100
      
      // Update state on UI thread
      runOnJS(setPercentage)(clampedPercent);
    },
  });

  return (
  <View style={{ flex: 1, backgroundColor: '#353535' }}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: INITIAL_SCROLL,
          paddingBottom: INITIAL_SCROLL,
        }}
      >
        {/* Spacer content to enable scrolling */}
        <View style={{ height: SCROLL_RANGE }} />
      </Animated.ScrollView>

    <View className="absolute inset-0 justify-center ml-5  pointer-events-none z-10">
        <Text className="text-9xl font-bold text-white">
          {percentage}%
        </Text>
      </View>

      <View
        // image container placed behind content
        style={{ position: 'absolute', bottom: -120, right: -140, zIndex: 0 }}
        pointerEvents="none"
      >
        <Image
          source={getFlowerImage(percentage)}
          style={{ width: 550, height: 550 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
