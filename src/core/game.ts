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
/**
 * Генерирует секретное число.
 * @param length - длина секрета
 * @param base - система счисления
 * @param random - источник случайности (по умолчанию Math.random)
 */
export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string => {
  const alphabet = '0123456789abcdef'.slice(0, base).split('');

  const result = Array.from({ length }).reduce<{
    pool: string[];
    secret: string;
  }>(
    (acc) => {
      // Выбираем случайный индекс из оставшихся доступных символов
      const randomIndex = Math.floor(random() * acc.pool.length);
      const selectedChar = acc.pool[randomIndex];

      return {
        // Иммутабельно удаляем выбранный символ из пула
        pool: acc.pool.filter((_, index) => index !== randomIndex),
        secret: acc.secret + selectedChar,
      };
    },
    { pool: alphabet, secret: '' }
  );

  return result.secret;
};
