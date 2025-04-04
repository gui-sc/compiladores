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
    '+',
    '-',
    ':',
    ';',
    '(',
    ')',
    '*',
    '\'',
    '"',
    '.',
    ',',
    '=',
    ">",
    "<",
    "$",
];

const partDelimitadores = {
    ':' : ['='],
    '>' : ['='],
    '<' : ['=', '>'],
}

const stringChars = [
    '\'',
    '"'
];

(async () => {
    const codigo = fs.readFileSync('./parteCodigo.txt', 'utf-8')
    let lexema = "";
    const lexemas = [];
    const tokens = [];
    const erros = [];
    let isSearchingString = null;
    let isLineComment = false;
    let isBlockComment = false;
    let isNumber = false;
    let isFloatNumber = false;
    codigo.split('\r\n').forEach((line, iLine, arr)=>{
        isLineComment = false;
        if(!line) return;
        lexema = ''
        line.split('').forEach((char, i, arr) => {
            // verifica se é um inicio ou final de comentario de linha ou bloco
            if (char == '/' && arr[i + 1] == '/') {
                isLineComment = true;
            } else if (char == '/' && arr[i + 1] == '*') {
                isBlockComment = true;
            } else if (char == '/' && arr[i - 1] == '*') {
                isBlockComment = false;
                return;
            }
            // enquanto estiver em um comentario de linha ou bloco, ignora os chars
            if (isLineComment || isBlockComment) return;
            console.log("char", char)
            // verifica se o lexema já é um token conhecido
            // serve para cobrir o caso dos delimitadores que podem ser dois tipos de delimitadores
            if (tokensMap[lexema]) {
            }else if (!(isNumber && char == '.') &&
            (tokensDelimitadores.includes(char) && !stringChars.includes(char))) {
                // verifica se é um token delimitador ou se é um char de string
                // ou ainda se é está lendo um número e o char é um ponto
                lexema = char
                // se o char pode ser dois tipos de delimitadores, verifica se o proximo char é igual ao delimitador
                // se for, adiciona o proximo char ao lexema e retorna a função para a próxima iteração
                if (partDelimitadores[char] && partDelimitadores[char].length > 0) {
                    if (partDelimitadores[char].includes(arr[i + 1])) {
                        lexema += arr[i + 1]
                        return;
                    }
                }
            } else if (char != ' ' || isSearchingString) {
                // se for diferente de espaço em branco ou se está dentro de uma string
                lexema += char
            } else {
                lexema = ''
            }
            // se o proximo char for um delimitador de string, verifica se é o mesmo delimitador que está sendo lido
            // se for, adiciona o token de string e limpa o lexema
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

            if (isNumber){
                console.log("number",lexema)
                console.log("teste",!(/\d/.test(arr[i+1]) || (arr[i+1] == '.')))
                if(char == '.') {
                    isFloatNumber = true;
                }
                if (!(/\d/.test(arr[i+1]) || (arr[i+1] == '.'))) {
                    // se o char não for um número e a flag de número estiver ativa, adiciona o token de número e limpa o lexema
                    if (isFloatNumber) {
                        const floatNumber = parseFloat(lexema);
                        // se o número for maior que 1000000 ou menor que -1000000, adiciona um erro léxico
                        if(!(floatNumber > -1000000 && floatNumber < 1000000)){
                            erros.push(`Número real fora do intervalo: ${floatNumber}`)
                        }
                        // adiciona o token de número real e limpa o lexema
                        tokens.push(tokensMap['nreal'])
                        lexemas.push(lexema)
                    } else {
                        const intNumber = parseInt(lexema);
                        // se o número for maior que 1000000 ou menor que -1000000, adiciona um erro léxico
                        if(!(intNumber > -1000000 && intNumber < 1000000)){
                            console.log(lexema)
                            erros.push(`Número inteiro fora do intervalo: ${intNumber}`) 
                        }
                        // adiciona o token de número inteiro e limpa o lexema
                        tokens.push(tokensMap['nint'])
                        lexemas.push(lexema)
                    }
                    lexema = ''
                    isNumber = false;
                    isFloatNumber = false;
                    return;
                }
                return;
            }
    
            if (!isSearchingString || !isNumber) {
                // se o char for um número, ativa a flag de número
                if (/\d/.test(char) && !/[a-zA-Z]/.test(lexema)) {
                    isNumber = true;
                }

                // se o char for um delimitador
                // se o próximo char for um delimitador
                // ou se está no final do arquivo
                // adiciona o token e limpa o lexema
                if (tokensDelimitadores.includes(char) || [...tokensDelimitadores, ' '].includes(arr[i + 1]) || (arr.length == i + 1)) {
                    // verifica se o lexema é um token conhecido
                    // se for, adiciona o token  de ident e limpa o lexema
                    if (tokensMap[lexema]) {
                        tokens.push(tokensMap[lexema])
                        lexemas.push(lexema)
                        lexema = ''
                    } else if (lexema.length > 0) {
                        tokens.push(tokensMap['ident'])
                        lexemas.push(lexema)
                        lexema = ''
                    }
                }
                // se o char for um delimitador, limpa o lexema
                if (tokensDelimitadores.includes(char)) {
                    lexema = ''
                }
            }
            // se chegar no final do arquivo e estiver dentro de uma string, lança um erro
            if (arr.length == i + 1 && isSearchingString) {
                erros.push(`Terminou o arquivo tentando ler ${isSearchingString == '"' ? "string" : "literal"}`)
            }
    
        });
    })
    // se tiver algum erro, imprime o erro e retorna
    // se não tiver erro, imprime os tokens e lexemas
    console.log(tokens);
    console.log(lexemas);
    if(erros.length > 0) {
        console.log(erros);
        return;
    }

})()