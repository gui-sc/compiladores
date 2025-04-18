exports.tabela = {
    PROGRAMA: {
        program: ["program", "ident", ";", "DECLARACOES", "BLOCO", "."],
    },

    DECLARACOES: {
        const: ["CONSTANTES", "VARIAVEIS", "PROCEDIMENTOS"],
        var: ["CONSTANTES", "VARIAVEIS", "PROCEDIMENTOS"],
        procedure: ["CONSTANTES", "VARIAVEIS", "PROCEDIMENTOS"],
        begin: ["CONSTANTES", "VARIAVEIS", "PROCEDIMENTOS"],
    },

    CONSTANTES: {
        const: ["const", "ident", "=", "nint", ";", "CONSTANTES"],
        var: ["ε"],
        procedure: ["ε"],
        begin: ["ε"],
    },

    VARIAVEIS: {
        var: ["var", "LISTAVARIAVEIS", ":", "TIPO", ";", "LDVAR"],
    },

    LDVAR: {
        ident: ["LISTAVARIAVEIS", ":", "TIPO", ";", "LDVAR"],
        procedure: ["ε"],
        begin: ["ε"],
    },

    TIPO: {
        integer: ["integer"],
        real: ["real"],
        string: ["string"],
    },

    LISTAVARIAVEIS: {
        ident: ["ident", "REPIDENT"],
    },

    REPIDENT: {
        ",": [",", "ident", "REPIDENT"],
        ":": ["ε"],
    },

    PROCEDIMENTOS: {
        procedure: [
            "procedure",
            "ident",
            "PARAMETROS",
            ";",
            "BLOCO",
            ";",
            "PROCEDIMENTOS",
        ],
        begin: ["ε"],
    },

    PARAMETROS: {
        "(": ["(", "LISTAVARIAVEIS", ":", "TIPO", "REPPARAMETROS", ")"],
        ";": ["ε"],
    },

    REPPARAMETROS: {
        ",": [",", "LISTAVARIAVEIS", ":", "TIPO", "REPPARAMETROS"],
        ")": ["ε"],
    },

    BLOCO: {
        begin: ["begin", "COMANDOS", "end"],
    },

    COMANDOS: {
        print: ["COMANDO", ";", "COMANDOS"],
        if: ["COMANDO", ";", "COMANDOS"],
        ident: ["COMANDO", ";", "COMANDOS"],
        for: ["COMANDO", ";", "COMANDOS"],
        while: ["COMANDO", ";", "COMANDOS"],
        read: ["COMANDO", ";", "COMANDOS"],
        end: ["ε"],
    },

    COMANDO: {
        print: ["print", "{", "ITEMSAIDA", "REPITEM", "}"],
        if: ["if", "EXPRELACIONAL", "then", "BLOCO", "ELSEOPC"],
        ident: ["ident", "CHAMADAPROC"],
        for: [
            "for",
            "ident",
            ":=",
            "EXPRESSAO",
            "to",
            "EXPRESSAO",
            "do",
            "BLOCO",
        ],
        while: ["while", "EXPRELACIONAL", "do", "BLOCO"],
        read: ["read", "(", "ident", ")"],
    },

    ELSEOPC: {
        else: ["else", "BLOCO"],
        ";": ["ε"],
    },

    CHAMADAPROC: {
        "(": ["LISTAPARAMETROS"],
        ":=": [":=", "EXPRESSAO"],
        ";": ["ε"],
    },

    LISTAPARAMETROS: {
        "(": ["(", "PAR", "REPPAR", ")"],
        ";": ["ε"],
    },

    PAR: {
        ident: ["ident"],
        nint: ["nint"],
        nreal: ["nreal"],
        vstring: ["vstring"],
        literal: ["literal"],
    },

    REPPAR: {
        ",": [",", "PAR", "REPPAR"],
        ")": ["ε"],
    },

    ITEMSAIDA: {
        "(": ["EXPRESSAO"],
        ident: ["EXPRESSAO"],
        nint: ["EXPRESSAO"],
        nreal: ["EXPRESSAO"],
        literal: ["EXPRESSAO"],
        vstring: ["EXPRESSAO"],
    },

    REPITEM: {
        ",": [",", "ITEMSAIDA", "REPITEM"],
        "}": ["ε"],
    },

    EXPRESSAO: {
        "(": ["TERMO", "EXPR"],
        ident: ["TERMO", "EXPR"],
        nint: ["TERMO", "EXPR"],
        nreal: ["TERMO", "EXPR"],
        literal: ["TERMO", "EXPR"],
        vstring: ["TERMO", "EXPR"],
    },

    EXPR: {
        "+": ["+", "TERMO", "EXPR"],
        "-": ["-", "TERMO", "EXPR"],
        ";": ["ε"],
        ")": ["ε"],
        ",": ["ε"],
        then: ["ε"],
        do: ["ε"],
        "=": ["ε"],
        "<>": ["ε"],
        "<": ["ε"],
        ">": ["ε"],
        "<=": ["ε"],
        ">=": ["ε"],
        '}': ['ε'],
        'to': ['ε']
    },

    TER: {
        "*": ["*", "FATOR", "TER"],
        "/": ["/", "FATOR", "TER"],
        "+": ["ε"],
        "-": ["ε"],
        ";": ["ε"],
        ")": ["ε"],
        ",": ["ε"],
        then: ["ε"],
        do: ["ε"],
        "=": ["ε"],
        "<>": ["ε"],
        "<": ["ε"],
        ">": ["ε"],
        "<=": ["ε"],
        ">=": ["ε"],
        '}': ['ε'],
        'to': ['ε']
    },

    TERMO: {
        "(": ["FATOR", "TER"],
        ident: ["FATOR", "TER"],
        nint: ["FATOR", "TER"],
        nreal: ["FATOR", "TER"],
        literal: ["FATOR", "TER"],
        vstring: ["FATOR", "TER"],
    },

    FATOR: {
        "(": ["(", "EXPRESSAO", ")"],
        ident: ["ident"],
        nint: ["nint"],
        nreal: ["nreal"],
        literal: ["literal"],
        vstring: ["vstring"],
    },

    EXPRELACIONAL: {
        "(": ["EXPRESSAO", "OPREL", "EXPRESSAO"],
        ident: ["EXPRESSAO", "OPREL", "EXPRESSAO"],
        nint: ["EXPRESSAO", "OPREL", "EXPRESSAO"],
        nreal: ["EXPRESSAO", "OPREL", "EXPRESSAO"],
        literal: ["EXPRESSAO", "OPREL", "EXPRESSAO"],
        vstring: ["EXPRESSAO", "OPREL", "EXPRESSAO"],
    },

    OPREL: {
        "=": ["="],
        "<>": ["<>"],
        "<": ["<"],
        ">": [">"],
        "<=": ["<="],
        ">=": [">="],
    },
};

const tokensMapInverse = {
    1: "while",
    2: "var",
    3: "to",
    4: "then",
    5: "string",
    6: "real",
    7: "read",
    8: "program",
    9: "procedure",
    10: "print",
    11: "nreal",
    12: "nint",
    13: "literal",
    14: "integer",
    15: "if",
    16: "ident",
    17: "for",
    18: "end",
    19: "else",
    20: "do",
    21: "const",
    22: "begin",
    23: "vstring",
    24: ">=",
    25: ">",
    26: "=",
    27: "<>",
    28: "<=",
    29: "<",
    30: "+",
    31: ";",
    32: ":=",
    33: ":",
    34: "/",
    35: ".",
    36: ",",
    37: "*",
    38: ")",
    39: "(",
    40: "{",
    41: "}",
    42: "-",
    43: "$",
};

const simboloInicial = "PROGRAMA";
const terminalEOF = "$";
const producaoVazia = "ε";

// Ex: tokens gerados pelo analisador léxico
// const tokens = [
//   { lexema: 'program', token: 8, line: 1 },
//   { lexema: 'x', token: 16, line: 1 },
//   { lexema: ';', token: 31, line: 1 },
//   ...
// ];

exports.parser = (tokens, tabela) => {
    const pilha = [terminalEOF, simboloInicial];
    const entrada = [...tokens, { token: 43, lexema: "$", line: -1 }]; // adiciona EOF
    let index = 0;

    while (pilha.length > 0) {
        const topo = pilha[pilha.length - 1];
        const atual = entrada[index];
        const terminalAtual = tokensMapInverse[atual.token];

        console.log(`\nPilha: [${pilha.join(", ")}]`);
        console.log(
            `Token atual: '${atual.lexema}' (cód ${atual.token}) na linha ${atual.line}`
        );

        // Terminal
        if (!tabela[topo]) {
            if (topo === terminalAtual) {
                pilha.pop();
                index++;
            } else {
                console.error(
                    `Erro sintático na linha ${atual.line}: esperado '${topo}', encontrado '${terminalAtual}'`
                );
                return;
            }
        }
        // Não-terminal
        else {
            const producoes = tabela[topo];
            const producao = producoes[terminalAtual];

            if (!producao) {
                console.error(
                    `Erro sintático na linha ${atual.line}: símbolo inesperado '${terminalAtual}' para '${topo}'`
                );
                return;
            }

            pilha.pop();
            if (producao[0] !== producaoVazia) {
                for (let i = producao.length - 1; i >= 0; i--) {
                    pilha.push(producao[i]);
                }
            }
        }
    }

    if (index === entrada.length) {
        console.log("\n✅ Análise sintática concluída com sucesso!");
    } else {
        console.error("\n❌ Fim da pilha alcançado antes do fim da entrada.");
    }
};
