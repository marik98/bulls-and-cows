export const createDigitValidator = (base: number) => {
  const validChars = '0123456789abcdef'.slice(0, base);

  return (char: string): boolean => {
    if (!char || char.length !== 1) return false;

    return validChars.includes(char.toLowerCase());
  };
};
