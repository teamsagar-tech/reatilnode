exports.normalizeMasterName = (name) => {
    if (!name) return '';
    let str = name.toLowerCase();
    
    // Strip all non-alphabetic characters (spaces, dashes, underscores, numbers)
    str = str.replace(/[^a-z]/g, '');
    
    // Strip trailing 's' to handle simple plurals (ignores 'ss' for words like 'dress')
    if (str.endsWith('s') && !str.endsWith('ss')) {
        str = str.slice(0, -1);
    }
    
    return str;
};
