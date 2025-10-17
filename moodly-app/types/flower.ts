export type FlowerPosition = 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left';

export interface FlowerMoodProps {
  percentage: number;
  position?: FlowerPosition;
  size?: number;
}
