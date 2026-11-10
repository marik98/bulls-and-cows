export const initialGameState = {
    status: 'settings',
    length: 4,
    base: 10,
    secret: '',
    history: [],
    startTime: null,
};
// Иммутабельное добавление попытки
export const addAttempt = (state, attempt) => {
    return {
        ...state,
        history: [...state.history, attempt], // Создаем новый массив
    };
};
// Иммутабельная установка статуса победы
export const setWinStatus = (state) => {
    return { ...state, status: 'won' };
};
