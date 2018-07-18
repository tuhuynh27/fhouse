export const normalizeStr = (str) => {
    const betterStr = str.trim().toLowerCase();

    return betterStr.charAt(0).toUpperCase() + betterStr.slice(1);
}

export const toCurrency = (number) => {
    if (number === 0) {
        return "0";
    }

    if (number < 1000) {
        return "~0k";
    }

    const mil = Math.floor(number / 1000000);
    const thou = Math.floor((number - mil * 1000000) / 1000);
    const approximate = number - mil * 1000000 - thou * 1000;

    return `${approximate ? "~" : ""}${mil ? mil + "m" : ""}${thou ? thou + "k" : ""}`;
}

export const toTitleCase = (str) => {
    if (str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

export const toUnsignedString = (str) => {
    const signedChars   = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    const unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    const pattern = new RegExp("[" + signedChars + "]", "g");
    return output = str.replace(pattern, function (m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
}

export const getLocationObj = (locationStr) => {
    let location = locationStr.toLowerCase().replace(/, /g, ',').split(',');
    return {
        ward: location[0],
        district: location[1],
        city: location[2],
        country: location[3]
    }
}
