/** Return the color associate to the flower for the color of the button */
export const getFlowerColor = (percent: number): string => {
  if (percent >= 100) return '#1CFF49'; 
  if (percent >= 85) return '#FFEC1C';  
  if (percent >= 70) return '#FF861C';  
  if (percent >= 50) return '#DDDDDD';  
  if (percent >= 30) return '#1CB0FF';  
  if (percent >= 15) return '#1C23FF';  
  return '#911CFF';                     
};


export const FLOWER_COLORS = {
  LEVEL_1: '#911CFF', // 0-14%   
  LEVEL_2: '#1C23FF', // 15-29%  
  LEVEL_3: '#1CB0FF', // 30-49%  
  LEVEL_4: '#DDDDDD', // 50-69%  
  LEVEL_5: '#FF861C', // 70-84%  
  LEVEL_6: '#FFEC1C', // 85-99%   
  LEVEL_7: '#1CFF49', // 100%   
} as const;
