import { describe, it, expect } from 'vitest';
import { isValidGuess, generateSecret } from './game';

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

  it('должна использовать только допустимые символы для выбранной системы', () => {
    const secretHex = generateSecret(6, 16);
    expect(/^[0-9a-f]{6}$/.test(secretHex)).toBe(true); // только hex-символы
  });

  it('должна использовать переданный источник случайности (детерминированный тест)', () => {
    // Создаем фейковую функцию random, которая всегда возвращает 0
    const mockRandom = () => 0;

    // Если random всегда 0, функция всегда должна брать первый доступный символ.
    // Для base=10 (0-9) и length=4 это будет '0123'.
    const secret = generateSecret(4, 10, mockRandom);

    expect(secret).toBe('0123');
  });
});
