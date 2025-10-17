export type FlowerPosition = 'bottom-right' | 'top-right' | 'middle';

export interface FlowerMoodProps {
  percentage: number;
  position?: FlowerPosition;
  size?: number;
}
