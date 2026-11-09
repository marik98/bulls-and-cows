import { createDigitValidator } from './validators';

/**
 * Проверяет, является ли догадка валидной.
 * Учитывает длину, систему счисления и уникальность цифр.
 */
export const isValidGuess = (
  guess: string,
  length: number,
  base: number
): boolean => {
  // 1. Проверка длины
  if (guess.length !== length) return false;

  // 2. Приводим к нижнему регистру для удобства и разбиваем на массив
  const chars = guess.toLowerCase().split('');

  // 3. Проверка на допустимые символы (используем каррированную функцию)
  const validator = createDigitValidator(base);
  if (!chars.every(validator)) return false;

  // 4. Проверка уникальности (Set хранит только уникальные значения)
  const uniqueChars = new Set(chars);

  return uniqueChars.size === chars.length;
};
