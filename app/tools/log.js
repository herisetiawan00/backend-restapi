module.exports = (request) => {
    const remoteAddress = "\x1b[47m\x1b[30m" + request.info.remoteAddress + "\x1b[0m";
    const method = request.method.toUpperCase();
    const path = request.path;
    const statusCode = request.response.statusCode;
    if (statusCode == 200) {
        console.log('%s: %s %s --> \x1b[42m\x1b[30m%s\x1b[0m', remoteAddress, method, path, statusCode)
    } else {
        console.log('%s: %s %s --> \x1b[41m\x1b[30m%s\x1b[0m', remoteAddress, method, path, statusCode)
    }
}