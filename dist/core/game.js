import { createDigitValidator } from './validators.js';
/**
 * Проверяет, является ли догадка валидной.
 */
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length)
        return false;
    const chars = guess.toLowerCase().split('');
    const validator = createDigitValidator(base);
    if (!chars.every(validator))
        return false;
    const uniqueChars = new Set(chars);
    return uniqueChars.size === chars.length;
};
/**
 * Генерирует секретное число.
 */
export const generateSecret = (length, base, random = Math.random) => {
    const alphabet = '0123456789abcdef'.slice(0, base).split('');
    const result = Array.from({ length }).reduce((acc) => {
        const randomIndex = Math.floor(random() * acc.pool.length);
        const selectedChar = acc.pool[randomIndex];
        return {
            pool: acc.pool.filter((_, index) => index !== randomIndex),
            secret: acc.secret + selectedChar,
        };
    }, { pool: alphabet, secret: '' });
    return result.secret;
};
/**
 * Сравнивает догадку с секретом.
 */
export const evaluateGuess = (secret, guess) => {
    const secretArr = secret.toLowerCase().split('');
    const guessArr = guess.toLowerCase().split('');
    const matches = guessArr.map((char, guessIndex) => {
        const secretIndex = secretArr.indexOf(char);
        return { char, guessIndex, secretIndex };
    });
    const bulls = matches.filter(({ guessIndex, secretIndex }) => secretIndex === guessIndex).length;
    const cows = matches.filter(({ secretIndex, guessIndex }) => secretIndex !== -1 && secretIndex !== guessIndex).length;
    return { bulls, cows };
};
const memoCache = new Map();
/**
 * Считает количество возможных секретов.
 */
export const countPossibleSecrets = (length, base) => {
    if (length === 0)
        return 1;
    if (length > base)
        return 0;
    const cacheKey = `${length}-${base}`;
    if (memoCache.has(cacheKey)) {
        return memoCache.get(cacheKey);
    }
    const result = base * countPossibleSecrets(length - 1, base - 1);
    memoCache.set(cacheKey, result);
    return result;
};
