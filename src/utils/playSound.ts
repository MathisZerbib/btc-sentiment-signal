export const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });
  };