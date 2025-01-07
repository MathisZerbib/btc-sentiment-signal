export const playSound = (soundFile: string, volume: number = 0.5) => {
  const audio = new Audio(soundFile);
  audio.volume = volume; // Set the volume to a lower level

  audio.addEventListener('error', (event) => {
    console.error("Failed to play sound:", event);
  });

  audio.play().catch((error) => {
    console.error("Failed to play sound:", error);
  });
};