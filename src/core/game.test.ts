import { describe, it, expect } from 'vitest';
import { isValidGuess } from './game';

describe('isValidGuess', () => {
  it('должна возвращать true для корректных догадок', () => {
    expect(isValidGuess('123', 3, 10)).toBe(true);
    expect(isValidGuess('012', 3, 10)).toBe(true); // ведущий ноль
    expect(isValidGuess('aBc', 3, 16)).toBe(true); // hex, разный регистр
  });

  it('должна возвращать false, если длина не совпадает', () => {
    expect(isValidGuess('12', 3, 10)).toBe(false);
    expect(isValidGuess('1234', 3, 10)).toBe(false);
  });

  it('должна возвращать false, если есть недопустимые символы для системы', () => {
    expect(isValidGuess('123', 3, 2)).toBe(false); // для bin допустимы только 0 и 1
    expect(isValidGuess('12a', 3, 10)).toBe(false); // для dec буквы недопустимы
  });

  it('должна возвращать false, если цифры повторяются', () => {
    expect(isValidGuess('112', 3, 10)).toBe(false);
    expect(isValidGuess('000', 3, 10)).toBe(false);
    expect(isValidGuess('aA1', 3, 16)).toBe(false); // a и A - одна и та же цифра
  });
});
