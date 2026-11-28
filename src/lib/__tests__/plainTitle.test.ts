import { describe, expect, it } from 'vitest';
import { bodyRegions, plainTitle } from '../plainTitle';

describe('plainTitle — mashg‘ulotning oddiy nomi', () => {
  it('o‘tirish, jim, tortish → oyoq, ko‘krak va orqa', () => {
    expect(plainTitle(['back-squat', 'bench-press', 'barbell-row'])).toBe('Oyoq, ko‘krak va orqa');
  });
  it('bir xil qism takrorlanmaydi; bitta qism — bitta so‘z', () => {
    expect(bodyRegions(['barbell-curl', 'db-curl'])).toEqual(['qo‘l']);
    expect(plainTitle(['barbell-curl', 'db-curl'])).toBe('Qo‘l');
  });
  it('ikki qism — «va» bilan', () => {
    expect(plainTitle(['bench-press', 'barbell-curl'])).toBe('Ko‘krak va qo‘l');
  });
  it('to‘rt va undan ko‘p qism — butun tana', () => {
    expect(plainTitle(['back-squat', 'bench-press', 'barbell-row', 'barbell-curl'])).toBe('Butun tana');
  });
  it('noma’lum yoki bo‘sh ro‘yxat — umumiy nom', () => {
    expect(plainTitle([])).toBe('Mashg‘ulot');
    expect(plainTitle(['yoq-bunday-mashq'])).toBe('Mashg‘ulot');
  });
});
