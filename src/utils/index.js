export function insensitiveSearch(refString = "", searchBy = "") {
    try {
        refString = removeSpecialChars(refString).toLowerCase().trim();
        searchBy = removeSpecialChars(searchBy).toLowerCase().trim();

        return refString.includes(searchBy);
    } catch (e) {
        console.log(e);
        return false;
    }
}

export function removeSpecialChars(str = "") {
    return str.replace(/[^\w\s]/gi, '');
}