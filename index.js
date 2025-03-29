const fs = require('fs')
const tokensMap = {
    "while": 1,
    "var": 2,
    "to": 3,
    "then": 4,
    "string": 5,
    "real": 6,
    "read": 7,
    "program": 8,
    "procedure": 9,
    "print": 10,
    "nreal": 11,
    "nint": 12,
    "literal": 13,
    "integer": 14,
    "if": 15,
    "ident": 16,
    "for": 17,
    "end": 18,
    "else": 19,
    "do": 20,
    "const": 21,
    "begin": 22,
    "vstring": 23,
    ">=": 24,
    ">": 25,
    "=": 26,
    "<>": 27,
    "<=": 28,
    "<": 29,
    "+": 30,
    ";": 31,
    ":=": 32,
    ":": 33,
    "/": 34,
    ".": 35,
    ",": 36,
    "*": 37,
    ")": 38,
    "(": 39,
    "{": 40,
    "}": 41,
    "-": 42,
    "$": 43,
};
const tokensDelimitadores = [
    '{',
    '}',
    '[',
    ']',
    '+',
    '-',
    '/',
    ':',
    ';',
    '(',
    ')',
    '*',
    '\'',
    '"'
];

const stringChars = [
    '\'',
    '"'
];

(async () => {
    const palavra = `program\n {programa} for " "`;
    let lexema = "";
    const lexemas = [];
    const tokens = [];
    let isSearchingString = null;
    palavra.split('\n').join('').split('').forEach((char, i, arr) => {
        if (tokensDelimitadores.includes(char) && !stringChars.includes(char)) {
            lexema = char
        } else if (char != ' ' || isSearchingString) {
            lexema += char
        } else {
            lexema = ''
        }
        if (stringChars.includes(char)) {
            if (isSearchingString) {
                if (char == isSearchingString) {
                    isSearchingString = null;
                    tokens.push(tokensMap[char == '\'' ? 'literal' : 'vstring'])
                    lexemas.push(lexema)
                    lexema = ''
                }
            } else {
                isSearchingString = char;
            }
        }

        if (!isSearchingString) {
            if (tokensDelimitadores.includes(char) || [...tokensDelimitadores, ' '].includes(arr[i + 1]) || (arr.length == i + 1)) {
                if (tokensMap[lexema]) {
                    tokens.push(tokensMap[lexema])
                    lexemas.push(lexema)
                } else if (lexema.length > 0) {
                    tokens.push(tokensMap['ident'])
                    lexemas.push(lexema)
                }
            }
            if (tokensDelimitadores.includes(char)) {
                lexema = ''
            }
        }

        if (arr.length == i + 1 && isSearchingString) {
            console.log(`Terminou o arquivo tentando ler ${isSearchingString == '"' ? "string" : "literal"}`)
            throw new Error(`Terminou o arquivo tentando ler ${isSearchingString == '"' ? "string" : "literal"}`)
        }

    });

    console.log(tokens);
    console.log(lexemas);

})()