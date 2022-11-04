export const prettyfy = (num: number) => {
    const separator = " ";
    return num?.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + separator);
};