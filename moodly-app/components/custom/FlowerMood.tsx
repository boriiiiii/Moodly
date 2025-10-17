import { View, Image } from 'react-native';
import type { FlowerMoodProps } from '@/types/flower';


const getFlowerImage = (percent: number) => {
  if (percent >= 100) return require('@/assets/images/flower-7.png');
  if (percent >= 85) return require('@/assets/images/flower-6.png');
  if (percent >= 70) return require('@/assets/images/flower-5.png');
  if (percent >= 50) return require('@/assets/images/flower-4.png');
  if (percent >= 30) return require('@/assets/images/flower-3.png');
  if (percent >= 15) return require('@/assets/images/flower-2.png');
  return require('@/assets/images/flower-1.png');
};


export function FlowerMood({ percentage }: FlowerMoodProps) {
  return (
    <View 
      className="absolute -bottom-[150px] -right-[140px] z-0"
      pointerEvents="none"
    >
      <Image
        source={getFlowerImage(percentage)}
        style={{ width: 550, height: 550 }}
        resizeMode="contain"
      />
    </View>
  );
}
