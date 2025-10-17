import { Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import type { EmotionToggleProps } from '@/types/emotions';

export function EmotionToggle({ label, isPressed, onPress }: EmotionToggleProps) {
  return (
    <Pressable 
      onPress={onPress}
      className={`rounded-3xl px-4 py-2.5 border-2 ${
        isPressed 
          ? 'bg-white border-white' 
          : 'bg-black border-white'
      }`}
    >
      <Text className={isPressed ? 'text-black' : 'text-white'}>
        {label}
      </Text>
    </Pressable>
  );
}
