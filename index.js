const {processLexico} = require('./lexico')
const {parser, tabela} = require('./sintatico')

function execute() {
    // const arquivo = process.argv[2];
    const arquivo = "./exemplos/lacos.txt"
    const {erros, tokens} = processLexico(arquivo)

    if(erros.length > 0){
        console.log("Erros léxicos encontrados: ", erros.join("\n"))
        return;
    }
    parser(tokens, tabela)
}

execute()