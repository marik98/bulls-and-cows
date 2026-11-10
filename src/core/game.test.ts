import { describe, it, expect } from 'vitest';
import {
  isValidGuess,
  generateSecret,
  evaluateGuess,
  countPossibleSecrets,
} from './game';

describe('isValidGuess', () => {
  it('должна возвращать true для корректных догадок', () => {
    expect(isValidGuess('123', 3, 10)).toBe(true);
    expect(isValidGuess('012', 3, 10)).toBe(true);
    expect(isValidGuess('aBc', 3, 16)).toBe(true);
  });

  it('должна возвращать false, если длина не совпадает', () => {
    expect(isValidGuess('12', 3, 10)).toBe(false);
    expect(isValidGuess('1234', 3, 10)).toBe(false);
  });

  it('должна возвращать false, если есть недопустимые символы', () => {
    expect(isValidGuess('123', 3, 2)).toBe(false);
    expect(isValidGuess('12a', 3, 10)).toBe(false);
  });

  it('должна возвращать false, если цифры повторяются', () => {
    expect(isValidGuess('112', 3, 10)).toBe(false);
    expect(isValidGuess('000', 3, 10)).toBe(false);
    expect(isValidGuess('aA1', 3, 16)).toBe(false);
  });
});

describe('generateSecret', () => {
  it('должна генерировать строку правильной длины', () => {
    const secret = generateSecret(4, 10);
    expect(secret.length).toBe(4);
  });

  it('должна содержать только уникальные символы', () => {
    const secret = generateSecret(4, 10);
    const uniqueChars = new Set(secret.split(''));
    expect(uniqueChars.size).toBe(4);
  });

  it('должна использовать только допустимые символы', () => {
    const secretHex = generateSecret(6, 16);
    expect(/^[0-9a-f]{6}$/.test(secretHex)).toBe(true);
  });

  it('должна использовать переданный источник случайности', () => {
    const mockRandom = () => 0;
    const secret = generateSecret(4, 10, mockRandom);
    expect(secret).toBe('0123');
  });
});

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
    const result = evaluateGuess('1234', '1243');
    expect(result).toEqual({ bulls: 2, cows: 2 });
  });

  it('должна работать со строками, начинающимися с нуля', () => {
    const result = evaluateGuess('0123', '3210');
    expect(result).toEqual({ bulls: 0, cows: 4 });
  });

  it('должна корректно сравнивать hex-цифры', () => {
    const result = evaluateGuess('abcd', 'ABCD');
    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it('должна правильно считать частичное совпадение', () => {
    const result = evaluateGuess('1234', '1563');
    expect(result).toEqual({ bulls: 1, cows: 1 });
  });
});

describe('countPossibleSecrets', () => {
  it('должна считать перестановки для простых случаев', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(3, 3)).toBe(6);
  });

  it('должна считать перестановки для неполных комбинаций', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });
});
