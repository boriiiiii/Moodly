import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { getFlowerColor } from '@/lib/flowerColors';
import type { MoodButtonProps } from '@/types/button';

export function MoodButton({ 
  percentage, 
  label, 
  onPress, 
  className = '' 
}: MoodButtonProps) {
  return (
    <Button 
      className={`rounded-xl ${className}`}
      style={{ backgroundColor: getFlowerColor(percentage) }}
      onPress={onPress}
    >
      <Text className="text-black font-medium">{label}</Text>
    </Button>
  );
}
