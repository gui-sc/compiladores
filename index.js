const { processLexico } = require('./lexico')
const { parser, tabela } = require('./sintatico')

function execute() {
    // const arquivo = process.argv[2];
    const arquivo = "./exemplos/procedures.txt"
    const { erros: errosLexicos, tokens } = processLexico(arquivo)

    if (errosLexicos.length > 0) {
        console.log("Erros léxicos encontrados: ", errosLexicos.join("\n"))
        return;
    }

    //Analise sintática
    parser(tokens);
}

execute()