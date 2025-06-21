class AnalisadorSemantico {

    constructor() {
        this.tabela_simbolos = [];
        this.erros = [];
    }

    acaoSemantica(tokenAtual, entrada, escopo) {
        const tokensPilha = [...entrada] //Evita referência circular
        console.log("Tokens na pilha:", tokensPilha);


        switch (tokenAtual.token) {
            case 21: {
                // const

                const nomeVariavel = tokensPilha[1].lexema;

                this.tabela_simbolos.push({
                    nome: nomeVariavel,
                    tipo: "integer",
                    categoria: "const",
                    nivel: escopo
                });
                console.log("Tabela:", this.tabela_simbolos);

                break;
            }

            case 2: {
                //var

                const nomeVariavel = tokensPilha[1].lexema;

                this.tabela_simbolos.push({
                    nome: nomeVariavel,
                    tipo: "integer",
                    categoria: "var",
                    nivel: escopo
                });
                console.log("Tabela:", this.tabela_simbolos);

                break;

            }

            case 16: {
                // Identificador

                const simbolo = this.tabela_simbolos.find(item => item.nome === tokenAtual.lexema && item.nivel === escopo);
                if (!simbolo) {
                    this.erros.push(`Linha ${tokenAtual.line}: 
                    identificador '${tokenAtual.lexema}' não declarado.`);
                    return;
                }

                break;
            }

            default:
                break;
        }
    }
}

module.exports = AnalisadorSemantico;