export const getDayOfTheWeek = date => date.getDay() === 0 ? 6 : date.getDay() - 1;

export const toServerDateTimeFormat = function (dateParam) {
    const date = new Date(dateParam);
    const ten = i => (i < 10 ? '0' : '') + i;
    const YYYY = date.getFullYear();
    const MM = ten(date.getMonth() + 1);
    const DD = ten(date.getDate());
    const HH = ten(date.getHours());
    const II = ten(date.getMinutes());
    const SS = ten(date.getSeconds());

    return `${YYYY}-${MM}-${DD}T${HH}:${II}:${SS}`;
}