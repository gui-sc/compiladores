const fs = require("fs");
const tokensMap = {
    while: 1,
    var: 2,
    to: 3,
    then: 4,
    string: 5,
    real: 6,
    read: 7,
    program: 8,
    procedure: 9,
    print: 10,
    nreal: 11,
    nint: 12,
    literal: 13,
    integer: 14,
    if: 15,
    ident: 16,
    for: 17,
    end: 18,
    else: 19,
    do: 20,
    const: 21,
    begin: 22,
    vstring: 23,
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
    $: 43,
};
const tokensDelimitadores = [
    "{",
    "}",
    "+",
    "-",
    ":",
    ";",
    "(",
    ")",
    "*",
    "'",
    '"',
    ".",
    ",",
    "=",
    ">",
    "<",
    "$",
];

const partDelimitadores = {
    ":": ["="],
    ">": ["="],
    "<": ["=", ">"],
};

const stringChars = ["'", '"'];
exports.processLexico = (arquivo) => {
    //Lê o arquivo passado como argumento
    const codigo = fs.readFileSync(arquivo, "utf-8");

    let lexema = "";
    const simbolos = [];
    const erros = [];
    let isSearchingString = null;
    let isLineComment = false;
    let isBlockComment = false;
    let isNumber = false;
    let isFloatNumber = false;
    codigo
        .split("\r")
        .join("")
        .split("\n")
        .forEach((line, iLine, arrLine) => {
            isLineComment = false;
            if (!line) return;
            lexema = "";
            line.split("").forEach((char, i, arr) => {
                // verifica se é um inicio ou final de comentario de linha ou bloco
                if (char == "/" && arr[i + 1] == "/" && !isSearchingString) {
                    isLineComment = true;
                } else if (char == "/" && arr[i + 1] == "*" && !isSearchingString) {
                    isBlockComment = true;
                } else if (char == "/" && arr[i - 1] == "*" && isBlockComment) {
                    isBlockComment = false;
                    return;
                }
                // enquanto estiver em um comentario de linha ou bloco, ignora os chars
                if (isLineComment || isBlockComment) return;
                // verifica se o lexema já é um token conhecido
                // serve para cobrir o caso dos delimitadores que podem ser dois tipos de delimitadores
                if (
                    Object.values(partDelimitadores).flat().includes(char) &&
                    partDelimitadores[arr[i - 1]] &&
                    partDelimitadores[arr[i - 1]].includes(char)
                ) {
                } else if (
                    !(isNumber && char == ".") &&
                    tokensDelimitadores.includes(char) &&
                    !stringChars.includes(char) &&
                    !isSearchingString
                ) {
                    // verifica se é um token delimitador ou se é um char de string
                    // ou ainda se é está lendo um número e o char é um ponto
                    lexema = char;
                    // se o char pode ser dois tipos de delimitadores, verifica se o proximo char é igual ao delimitador
                    // se for, adiciona o proximo char ao lexema e retorna a função para a próxima iteração
                    if (
                        partDelimitadores[char] &&
                        partDelimitadores[char].length > 0
                    ) {
                        if (partDelimitadores[char].includes(arr[i + 1])) {
                            lexema += arr[i + 1];
                            return;
                        }
                    }
                } else if (char != " " || isSearchingString) {
                    lexema += char;
                    // se for diferente de espaço em branco ou se está dentro de uma string
                } else if (char == " " && isNumber) {
                    return;
                } else {
                    lexema = "";
                }
                // se o proximo char for um delimitador de string, verifica se é o mesmo delimitador que está sendo lido
                // se for, adiciona o token de string e limpa o lexema
                if (stringChars.includes(char)) {
                    if (isSearchingString) {
                        if (char == isSearchingString) {
                            isSearchingString = null;
                            simbolos.push({
                                lexema,
                                token: tokensMap[
                                    char == "'" ? "literal" : "vstring"
                                ],
                                line: iLine + 1,
                            });
                            lexema = "";
                        }
                    } else {
                        isSearchingString = char;
                    }
                }
                // Detecta início de número negativo
                const prevChar = previousNonWhitespace(arr, i);
                const nextChar = nextNonWhitespace(arr, i);
                if (
                    char === "-" && // é um traço
                    (i === 0 || // início da linha
                        tokensMap[simbolos[simbolos.length - 1].lexema] || // ultimo simbolo adicionado era uma palavra reservada
                        tokensDelimitadores.includes(prevChar) || // depois de delimitador
                        prevChar === undefined) && // início do arquivo/linha
                    /\d/.test(nextChar) // o próximo é número
                    && !isSearchingString // não está dentro de uma string
                ) {
                    isNumber = true;
                    lexema = "-";
                    return; // vai para o próximo caractere, para construir o número
                }
                // se o char for um número, ativa a flag de número
                if (
                    /\d/.test(char) &&
                    !/[a-zA-Z_]/.test(lexema) &&
                    (!/[a-zA-Z_]/.test(arr[i + 1]) || arr[i + 1] == undefined) &&
                    !isSearchingString 
                ) {
                    isNumber = true;
                }

                if (isNumber) {
                    if (char == ".") {
                        isFloatNumber = true;
                    }
                    if (!(/\d/.test(arr[i + 1]) || arr[i + 1] == ".")) {
                        // se o char não for um número e a flag de número estiver ativa, adiciona o token de número e limpa o lexema
                        if (isFloatNumber) {
                            const floatNumber = parseFloat(lexema);
                            // se o número for maior que 1000000 ou menor que -1000000, adiciona um erro léxico
                            if (
                                !(
                                    floatNumber > -1000000 &&
                                    floatNumber < 1000000
                                )
                            ) {
                                erros.push(
                                    `Atribuição de valor com tamanho além do escopo permitido na linha ${iLine + 1}`
                                );
                            }
                            if (lexema.split(".")[1].length > 2) {
                                erros.push(
                                    `Atribuição de valor com tamanho além do escopo permitido na linha ${iLine + 1}`
                                );
                            }
                            // adiciona o token de número real e limpa o lexema
                            simbolos.push({
                                lexema,
                                token: tokensMap["nreal"],
                                line: iLine + 1,
                            });
                        } else {
                            const intNumber = parseInt(lexema);
                            // se o número for maior que 1000000 ou menor que -1000000, adiciona um erro léxico
                            if (
                                !(intNumber > -1000000 && intNumber < 1000000)
                            ) {
                                console.log("lexema", lexema);
                                erros.push(
                                    `Atribuição de valor com tamanho além do escopo permitido na linha ${iLine + 1}`
                                );
                            }
                            // adiciona o token de número inteiro e limpa o lexema

                            simbolos.push({
                                lexema,
                                token: tokensMap["nint"],
                                line: iLine + 1,
                            });
                        }
                        lexema = "";
                        isNumber = false;
                        isFloatNumber = false;
                        return;
                    }
                    return;
                }

                if (!isSearchingString && !isNumber) {
                    // se o char for um delimitador
                    // se o próximo char for um delimitador
                    // ou se está no final do arquivo
                    // adiciona o token e limpa o lexema
                    if (
                        tokensDelimitadores.includes(char) ||
                        [...tokensDelimitadores, " "].includes(arr[i + 1]) ||
                        arr.length == i + 1
                    ) {
                        // verifica se o lexema é um token conhecido
                        // se for, adiciona o token  de ident e limpa o lexema
                        if (tokensMap[lexema]) {
                            simbolos.push({
                                lexema,
                                token: tokensMap[lexema],
                                line: iLine + 1,
                            });
                            lexema = "";
                        } else if (lexema.length > 0) {
                            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(lexema)) {
                                erros.push(
                                    `Caractere inesperado na linha ${iLine + 1}: ${lexema}`
                                );
                            }
                            simbolos.push({
                                lexema,
                                token: tokensMap["ident"],
                                line: iLine + 1,
                            });
                            lexema = "";
                        }
                    }
                    // se o char for um delimitador, limpa o lexema
                    if (tokensDelimitadores.includes(char)) {
                        lexema = "";
                    }
                }
                // se chegar no final do arquivo e estiver dentro de uma string, lança um erro
            });
            if (arrLine.length == iLine + 1) {
                if (isSearchingString) {
                    erros.push(
                        ` Chegou ao fim do arquivo enquanto escaneava um${isSearchingString == '"' ? "a string" : " literal"
                        }`
                    );
                } else if (isBlockComment) {
                    erros.push(
                        "Chegou ao fim do arquivo escaneando um comentário"
                    );
                }
            }
        });
    // se tiver algum erro, imprime o erro e retorna
    // se não tiver erro, imprime os tokens e lexemas
    return { tokens: simbolos, erros };
};
function previousNonWhitespace(arr, currentIndex) {
    let idx = currentIndex - 1;
    while (idx >= 0 && arr[idx] === ' ') idx--;
    return arr[idx];
}
function nextNonWhitespace(arr, currentIndex) {
    let idx = currentIndex + 1;
    while (idx >= 0 && arr[idx] === ' ') idx++;
    return arr[idx];
}