export function formatChileanPhoneNumber(input) {
    const numeroLimpio = input.replace(/[^0-9kK]/g, "");

    const numerosTelefono = numeroLimpio.slice(3);

    let primeros;
    let segundos;

    if (numerosTelefono.length > 8) {
        return `+56 9 ${numerosTelefono.slice(0, 4)} ${numerosTelefono.slice(
            4,
            8
        )}`;
    } else if (numerosTelefono.length > 4) {
        primeros = numerosTelefono.slice(0, 4);
        segundos = numerosTelefono.slice(4);
        return `+56 9 ${primeros} ${segundos}`;
    }

    return `+56 9 ${numerosTelefono}`;
}

export const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);

    const hora = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${year}-${month}-${day} ${hora}:${minutos}`;
};

export const formatNumberToCurrency = (num) => {
    if (!num) return "$ 0";

    if (typeof num === "string") {
        // Try to convert the string to a number
        num = parseFloat(num.replace(/,/g, ""));

        if (isNaN(num)) {
            throw new TypeError("Input string must be a valid number");
        }
    } else if (typeof num !== "number") {
        throw new TypeError("Input must be a number or a numeric string");
    }

    let [integer] = num.toFixed(0).split(".");

    let reversed = integer.split("").reverse().join("");

    let withDots = reversed.match(/.{1,3}/g).join(".");

    let formatted = withDots.split("").reverse().join("");

    return "$ " + formatted;
};

export const formatCurrencyToNumber = (currency) => {
    if (typeof currency !== "string") {
        throw new TypeError("Input must be a string");
    }

    let numberString = currency.replace(/[$,.]/g, "");
    let number = parseInt(numberString, 10);

    return number;
};

export const inputFormatNumberToCurrency = (num) => {
    const cleanNumber = num.replace(/[^0-9]/g, "");

    if (cleanNumber.length < 1) return cleanNumber;

    let [integer] = cleanNumber.split(".");

    let reversed = integer.split("").reverse().join("");

    let withDots = reversed.match(/.{1,3}/g).join(".");

    let formatted = withDots.split("").reverse().join("");

    return `$ ${formatted}`;
};

export const formatRut = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, "");
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    if (rutLimpio.length < 2) return rutLimpio;

    if (rutLimpio.length >= 9) {
        let cuerpo = rutLimpio.substring(0, 8);
        let dv = rutLimpio.charAt(8);

        let cuerpoFormatoMiles = cuerpo
            .toString()
            .split("")
            .reverse()
            .join("")
            .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        cuerpoFormatoMiles = cuerpoFormatoMiles
            .split("")
            .reverse()
            .join("")
            .replace(/^[.]/, "");

        return `${cuerpoFormatoMiles}-${dv}`;
    }

    let cuerpoFormatoMiles = cuerpo
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
    cuerpoFormatoMiles = cuerpoFormatoMiles
        .split("")
        .reverse()
        .join("")
        .replace(/^[.]/, "");

    return `${cuerpoFormatoMiles}-${dv}`;
};

export const validateRut = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, "");
    if (rutLimpio.length < 2) return false;
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    if (!cuerpo.replace(/[^0-9]/g, "")) return false;
    if (isNaN(cuerpo) || cuerpo >= 50000000) return false;
    // Calculate verification digit
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += cuerpo.charAt(i) * multiplo;
        multiplo = (multiplo + 1) % 8 || 2;
    }
    const resultado = 11 - (suma % 11);
    const verificador =
        resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();

    let isValidRut = false;
    const res = verificador === dv;
    if (rut && res === true) {
        isValidRut = true;
    }
    return isValidRut;
};

export const validateRutMerchant = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, "");
    if (rutLimpio.length < 2) return false;
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    if (!cuerpo.replace(/[^0-9]/g, "")) return false;
    // Calculate verification digit
    if (isNaN(cuerpo) || cuerpo < 50000000) return false;
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += cuerpo.charAt(i) * multiplo;
        multiplo = (multiplo + 1) % 8 || 2;
    }
    const resultado = 11 - (suma % 11);
    const verificador =
        resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();

    let isValidRut = false;
    const res = verificador === dv;
    if (rut && res === true) {
        isValidRut = true;
    }
    return isValidRut;
};

export const formatDateToDDMMYY = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const formatDateToHHMMDDMMYY = (dateString) => {
    const date = new Date(dateString);

    const hora = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${hora}:${minutos} ${day}-${month}-${year}`;
};

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    return emailRegex.test(email);
}
