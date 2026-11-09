import {
  GameState,
  initialGameState,
  addAttempt,
  setWinStatus,
} from './state.js';
import { isValidGuess, generateSecret, evaluateGuess } from './core/game.js';
import { createDigitValidator } from './core/validators.js';

// Текущее состояние игры
let state: GameState = initialGameState;
const appRoot = document.getElementById('app')!;

// Функция для обновления состояния и перерисовки
const updateState = (newState: GameState) => {
  state = newState;
  render();
};

// --- ГЕНЕРАЦИЯ UI (без innerHTML) ---

const createElement = (tag: string, text?: string) => {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  return el;
};

const renderSettings = () => {
  const container = createElement('div');
  container.appendChild(createElement('h2', 'Настройки игры'));

  // Выбор системы счисления
  const baseSelect = document.createElement('select');
  [2, 8, 10, 16].forEach((b) => {
    const option = document.createElement('option');
    option.value = b.toString();
    option.textContent =
      b === 2
        ? 'Bin (2)'
        : b === 8
          ? 'Oct (8)'
          : b === 10
            ? 'Dec (10)'
            : 'Hex (16)';
    baseSelect.appendChild(option);
  });
  baseSelect.value = state.base.toString();

  // Выбор длины
  const lengthSelect = document.createElement('select');
  const lengths = [2, 3, 4, 5, 6];

  const updateLengthOptions = (base: number) => {
    lengthSelect.replaceChildren();
    lengths.forEach((len) => {
      if (len <= base) {
        const option = document.createElement('option');
        option.value = len.toString();
        option.textContent = len.toString();
        lengthSelect.appendChild(option);
      }
    });
    lengthSelect.value = Math.min(state.length, base).toString();
  };

  updateLengthOptions(state.base);

  baseSelect.addEventListener('change', (e) => {
    updateLengthOptions(Number((e.target as HTMLSelectElement).value));
  });

  // Кнопка старта
  const startBtn = createElement('button', 'Начать игру') as HTMLButtonElement;
  startBtn.addEventListener('click', () => {
    const selectedLength = Number(lengthSelect.value);
    const selectedBase = Number(baseSelect.value);
    const secret = generateSecret(selectedLength, selectedBase);

    updateState({
      ...state,
      status: 'playing',
      length: selectedLength,
      base: selectedBase,
      secret,
      history: [],
      startTime: Date.now(),
    });
  });

  container.append(
    createElement('label', 'Система счисления: '),
    baseSelect,
    createElement('br'),
    createElement('br'),
    createElement('label', 'Длина числа: '),
    lengthSelect,
    createElement('br'),
    startBtn
  );

  appRoot.replaceChildren(container);
};

const renderGame = () => {
  const container = createElement('div');
  container.appendChild(
    createElement(
      'h2',
      `Угадайте число из ${state.length} цифр (система ${state.base})`
    )
  );

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = state.length;

  // Фильтрация ввода в реальном времени
  const validator = createDigitValidator(state.base);
  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const validValue = target.value.split('').filter(validator).join('');
    if (target.value !== validValue) {
      target.value = validValue;
    }
  });

  const submitBtn = createElement('button', 'Проверить') as HTMLButtonElement;

  submitBtn.addEventListener('click', () => {
    const guess = input.value.toLowerCase();

    if (!isValidGuess(guess, state.length, state.base)) {
      alert(
        `Введите ${state.length} уникальных символов из системы ${state.base}`
      );
      return;
    }

    const result = evaluateGuess(state.secret, guess);
    const newAttempt = { guess, result };

    // Иммутабельно добавляем попытку
    let newState = addAttempt(state, newAttempt);

    if (result.bulls === state.length) {
      newState = setWinStatus(newState);
    }

    updateState(newState);
  });

  container.append(input, submitBtn, createElement('hr'));

  // История попыток
  const historyContainer = createElement('div');
  state.history.forEach((attempt) => {
    const item = createElement(
      'div',
      `${attempt.guess} - Быки: ${attempt.result.bulls}, Коровы: ${attempt.result.cows}`
    );
    item.className = 'history-item';
    historyContainer.appendChild(item);
  });
  container.appendChild(historyContainer);

  appRoot.replaceChildren(container);
};

const renderWin = () => {
  const container = createElement('div');
  container.appendChild(createElement('h2', '🎉 Победа!'));

  const timeSpent = state.startTime
    ? Math.floor((Date.now() - state.startTime) / 1000)
    : 0;
  container.appendChild(
    createElement(
      'p',
      `Вы угадали число ${state.secret} за ${state.history.length} попыток.`
    )
  );
  container.appendChild(createElement('p', `Время: ${timeSpent} секунд.`));

  // Сохранение в localStorage
  saveRecord(state.history.length, timeSpent);

  const newGameBtn = createElement('button', 'Новая игра') as HTMLButtonElement;
  newGameBtn.addEventListener('click', () => {
    updateState({
      ...initialGameState,
      base: state.base,
      length: state.length,
    });
  });

  container.appendChild(newGameBtn);
  appRoot.replaceChildren(container);
};

// --- Функции для работы с рекордами ---

interface GameRecord {
  attempts: number;
  time: number;
  length: number;
  base: number;
  date: string;
}

const saveRecord = (attempts: number, time: number) => {
  const recordsStr = localStorage.getItem('bulls-cows-records');
  const records: GameRecord[] = recordsStr ? JSON.parse(recordsStr) : [];

  records.push({
    attempts,
    time,
    length: state.length,
    base: state.base,
    date: new Date().toISOString(),
  });

  // Сортируем: сначала по попыткам, потом по времени
  records.sort(
    (a: GameRecord, b: GameRecord) => a.attempts - b.attempts || a.time - b.time
  );

  // Оставляем топ-10
  localStorage.setItem(
    'bulls-cows-records',
    JSON.stringify(records.slice(0, 10))
  );
};

// --- Главная функция рендера ---

const render = () => {
  if (state.status === 'settings') {
    renderSettings();
  } else if (state.status === 'playing') {
    renderGame();
  } else if (state.status === 'won') {
    renderWin();
  }
};

// Инициализация
render();
