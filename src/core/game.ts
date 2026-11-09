import { createDigitValidator } from './validators';
import { isValidGuess, generateSecret, evaluateGuess } from './game';

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
describe('evaluateGuess', () => {
  it('должна возвращать 0 bulls и 0 cows, если ничего не угадано', () => {
    const result = evaluateGuess('1234', '5678');
    expect(result).toEqual({ bulls: 0, cows: 0 });
  });

  it('должна возвращать правильное количество bulls, если всё угадано', () => {
    const result = evaluateGuess('1234', '1234');
    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it('должна правильно считать bulls и cows в перемешанном варианте', () => {
    // секрет 1234, попытка 1243
    // bulls: 1 и 2 на своих местах (2 штуки)
    // cows: 3 и 4 угаданы, но не на своих местах (2 штуки)
    const result = evaluateGuess('1234', '1243');
    expect(result).toEqual({ bulls: 2, cows: 2 });
  });

  it('должна работать со строками, начинающимися с нуля', () => {
    const result = evaluateGuess('0123', '3210');
    expect(result).toEqual({ bulls: 0, cows: 4 });
  });

  it('должна корректно сравнивать hex-цифры независимо от регистра', () => {
    const result = evaluateGuess('abcd', 'ABCD');
    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it('должна правильно считать частичное совпадение', () => {
    // секрет 1234, попытка 1563
    // bulls: 1 на месте (1 шт)
    // cows: 3 угадана, но не на месте (1 шт)
    // 5 и 6 - вообще нет в секрете
    const result = evaluateGuess('1234', '1563');
    expect(result).toEqual({ bulls: 1, cows: 1 });
  });
});
export interface GuessResult {
  bulls: number;
  cows: number;
}

/**
 * Сравнивает догадку с секретом, возвращая количество быков и коров.
 * Реализовано через функции высшего порядка (map/filter).
 */
export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretArr = secret.toLowerCase().split('');
  const guessArr = guess.toLowerCase().split('');

  // Проходим по каждому символу догадки и запоминаем его индексы
  const matches = guessArr.map((char, guessIndex) => {
    const secretIndex = secretArr.indexOf(char);
    return { char, guessIndex, secretIndex };
  });

  // Bulls: символы, у которых индекс в секрете совпал с индексом в догадке
  const bulls = matches.filter(
    ({ guessIndex, secretIndex }) => secretIndex === guessIndex
  ).length;

  // Cows: символы, которые есть в секрете (secretIndex !== -1),
  // но стоят не на той же позиции (secretIndex !== guessIndex)
  const cows = matches.filter(
    ({ secretIndex, guessIndex }) =>
      secretIndex !== -1 && secretIndex !== guessIndex
  ).length;

  return { bulls, cows };
};
