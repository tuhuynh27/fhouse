export const normalizeStr = (str) => {
    let betterStr = str.trim().toLowerCase();

    return betterStr.charAt(0).toUpperCase() + betterStr.slice(1);
}

export const toCurrency = (number) => {
    if (number === 0) {
        return "0";
    }

    if (number < 1000) {
        return "~0k";
    }

    let mil = Math.floor(number / 1000000);
    let thou = Math.floor((number - mil * 1000000) / 1000);
    let approximate = number - mil * 1000000 - thou * 1000;

    return `${approximate ? "~" : ""}${mil ? mil + "m" : ""}${thou ? thou + "k" : ""}`;
}

export const toTitleCase = (str) => {
    if (str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}