export interface Emotions {
  colere: boolean;
  Inquiétude: boolean;
  tristesse: boolean;
  peur: boolean;
  anxiete: boolean;
  frustration: boolean;
}

export interface EmotionToggleProps {
  label: string;
  isPressed: boolean;
  onPress: () => void;
}
