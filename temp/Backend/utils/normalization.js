exports.normalizeMasterName = (name) => {
    if (name === undefined || name === null) return '';
    let str = String(name).toLowerCase();
    
    // Strip all non-alphanumeric characters (spaces, dashes, underscores)
    str = str.replace(/[^a-z0-9]/g, '');
    
    // Strip trailing 's' to handle simple plurals (ignores 'ss' for words like 'dress')
    if (str.endsWith('s') && !str.endsWith('ss')) {
        str = str.slice(0, -1);
    }
    
    return str;
};
