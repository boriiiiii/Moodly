import { Text, View, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

export default function TabTwoScreen() {
  const scrollY = useSharedValue(0);
  const [percentage, setPercentage] = useState(50);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Total scroll range 
  // Lower value = more sensitive (less scrolling needed)
  const SCROLL_RANGE = 400; // pixels to scroll from 0% to 100%
  const INITIAL_SCROLL = SCROLL_RANGE / 2; // Start at 50%

  // Initialize scroll position to 50% after layout is ready
  const handleLayout = () => {
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

  
  const getFlowerImage = (percent: number) => {
    if (percent >= 100) return require('@/assets/images/flower-7.png');
    if (percent >= 85) return require('@/assets/images/flower-6.png');
    if (percent >= 70) return require('@/assets/images/flower-5.png');
    if (percent >= 50) return require('@/assets/images/flower-4.png');
    if (percent >= 30) return require('@/assets/images/flower-3.png');
    if (percent >= 15) return require('@/assets/images/flower-2.png');
    return require('@/assets/images/flower-1.png');
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const scrollPosition = event.contentOffset.y;
      scrollY.value = scrollPosition;
      
      // Calculate percentage based on scroll position
      // When scrollPosition = 0, we're at the top padding (0%)
      // When scrollPosition = SCROLL_RANGE, we're at 100%
      const percent = Math.round((scrollPosition / SCROLL_RANGE) * 100);
      const clampedPercent = Math.max(0, Math.min(100, percent));
      
      // Update state on UI thread
      runOnJS(setPercentage)(clampedPercent);
    },
  });

  return (
  <View style={{ flex: 1, backgroundColor: '#353535' }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        onLayout={handleLayout}
        scrollEventThrottle={16} // ~60fps
        showsVerticalScrollIndicator={false} // hide scrollbar
        bounces={false} // Disable bounce effect
        overScrollMode="never" // Disable overscroll for Android
      >
        {/* Top spacer - scroll down to decrease percentage */}
        <View style={{ height: SCROLL_RANGE }} />
        
        {/* Middle marker with color sections to visualize scroll range */}
        <View style={{ height: SCROLL_RANGE }}>
         
        </View>
        
        {/* Bottom spacer - scroll up to increase percentage */}
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
