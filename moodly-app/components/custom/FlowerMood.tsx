import { View, Image } from 'react-native';
import type { FlowerMoodProps, FlowerPosition } from '@/types/flower';


const getFlowerImage = (percent: number): number => {
  if (percent >= 100) return require('@/assets/images/flower-7.png');
  if (percent >= 85) return require('@/assets/images/flower-6.png');
  if (percent >= 70) return require('@/assets/images/flower-5.png');
  if (percent >= 50) return require('@/assets/images/flower-4.png');
  if (percent >= 30) return require('@/assets/images/flower-3.png');
  if (percent >= 15) return require('@/assets/images/flower-2.png');
  return require('@/assets/images/flower-1.png');
};


const getPositionClasses = (position: FlowerPosition): string => {
  switch (position) {
    case 'top-right':
      return 'absolute -top-[170px] -right-[170px] z-0';
    case 'middle' : 
        return 'absolute bottom-[49px] left-1/2 -translate-x-1/2 z-0';
    case 'bottom-right':
    default:
      return 'absolute -bottom-[150px] -right-[140px] z-0';
  }
};


export function FlowerMood({ 
  percentage, 
  position = 'bottom-right',
  size = 550 
}: FlowerMoodProps) {
  return (
    <View 
      className={getPositionClasses(position)}
      pointerEvents="none"
    >
      <Image
        source={getFlowerImage(percentage)}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
