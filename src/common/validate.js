export const validatePhone = (str) => {
    regex = /\d{10,11}/;
    return regex.test(str);
}

export const validateNumber = (str) => {
    regex = /\d/;
    return regex.test(str);
}

export const greaterThanZero = (str) => {
    return parseInt(str) > 0
}