const {processLexico} = require('./lexico')
const {parser, tabela} = require('./sintatico')
const fs = require('fs')

function execute() {
    // const arquivo = process.argv[2];
    const arquivo = "./exemplos/lacos.txt"
    const {erros, tokens} = processLexico(arquivo)
    fs.writeFileSync('./tokens.json', JSON.stringify(tokens, null, 2))
    if(erros.length > 0){
        console.log("Erros léxicos encontrados: ", erros.join("\n"))
        return;
    }
    parser(tokens, tabela)
}

execute()