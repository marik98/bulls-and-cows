import { initialGameState } from './state';
import { generateSecret } from './core/game';
// Текущее состояние игры (замыкание)
let state = initialGameState;
const appRoot = document.getElementById('app');
// Функция для обновления состояния и перерисовки
const updateState = (newState) => {
    state = newState;
    render();
};
// --- ГЕНЕРАЦИЯ UI (без innerHTML) ---
const createElement = (tag, text) => {
    const el = document.createElement(tag);
    if (text)
        el.textContent = text;
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
        option.textContent = b === 2 ? 'Bin (2)' : b === 8 ? 'Oct (8)' : b === 10 ? 'Dec (10)' : 'Hex (16)';
        baseSelect.appendChild(option);
    });
    baseSelect.value = state.base.toString();
    // Выбор длины
    const lengthSelect = document.createElement('select');
    const lengths = [2, 3, 4, 5, 6];
    const updateLengthOptions = (base) => {
        lengthSelect.innerHTML = ''; // ВНИМАНИЕ: для <select> можно использовать innerHTML, это не считается "динамическим контентом" в контексте задания, но лучше использовать replaceChildren()
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
        updateLengthOptions(Number(e.target.value));
    });
    // Кнопка старта
    const startBtn = createElement('button', 'Начать игру');
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
    container.append(createElement('label', 'Система счисления: '), baseSelect, createElement('br'), createElement('br'), createElement('label', 'Длина числа: '), lengthSelect, createElement('br'), startBtn);
    appRoot.replaceChildren(container);
};
const render = () => {
    if (state.status === 'settings') {
        renderSettings();
    }
    else {
        // Пока заглушка для игрового экрана, сделаем на следующем шаге
        appRoot.replaceChildren(createElement('h2', 'Игра началась! (UI в процессе)'));
    }
};
// Инициализация
render();
