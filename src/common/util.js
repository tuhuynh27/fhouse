String.prototype.normalize = function() {
    let str = this.trim().toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCurrency(number) {
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