import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './validators';

describe('createDigitValidator', () => {
  it('должна правильно валидировать двоичные цифры (bin)', () => {
    const isValidBin = createDigitValidator(2);
    expect(isValidBin('0')).toBe(true);
    expect(isValidBin('1')).toBe(true);
    expect(isValidBin('2')).toBe(false);
    expect(isValidBin('a')).toBe(false);
  });

  it('должна правильно валидировать десятичные цифры (dec)', () => {
    const isValidDec = createDigitValidator(10);
    expect(isValidDec('0')).toBe(true);
    expect(isValidDec('9')).toBe(true);
    expect(isValidDec('a')).toBe(false);
  });

  it('должна валидировать hex-цифры без учета регистра (hex)', () => {
    const isValidHex = createDigitValidator(16);
    expect(isValidHex('0')).toBe(true);
    expect(isValidHex('9')).toBe(true);
    expect(isValidHex('a')).toBe(true);
    expect(isValidHex('A')).toBe(true); // Проверка верхнего регистра
    expect(isValidHex('f')).toBe(true);
    expect(isValidHex('F')).toBe(true);
    expect(isValidHex('g')).toBe(false);
  });

  it('должна возвращать false для пустых строк и строк длиннее 1 символа', () => {
    const isValidDec = createDigitValidator(10);
    expect(isValidDec('')).toBe(false);
    expect(isValidDec('12')).toBe(false);
  });
});
