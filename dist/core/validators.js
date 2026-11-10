export const createDigitValidator = (base) => {
    const validChars = '0123456789abcdef'.slice(0, base);
    return (char) => {
        if (!char || char.length !== 1)
            return false;
        return validChars.includes(char.toLowerCase());
    };
};
