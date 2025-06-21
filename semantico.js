class AnalisadorSemantico {

    constructor() {
        this.tabela_simbolos = [];
        this.erros = [];
    }

    acaoSemantica(tokenAtual, entrada, escopo) {
        const tokensPilha = [...entrada] //Evita referência circular
        console.log("Tokens na pilha:", tokensPilha);

        switch (tokenAtual.token) {
            case 8: {
                //program

                const nomePrograma = tokensPilha[1].lexema;
                this.tabela_simbolos.push({
                    nome: nomePrograma,
                    tipo: "program",
                    categoria: "program",
                    nivel: "global"
                });
                break;
            }

            case 21: {
                // const

                const nomeVariavel = tokensPilha[1].lexema;
                const simboloExistente = this.tabela_simbolos.find(item => item.nome === nomeVariavel);
                if (simboloExistente) {
                    this.erros.push(`Linha ${tokenAtual.line}: constante '${nomeVariavel}' já declarada.`);
                    return;
                }

                this.tabela_simbolos.push({
                    nome: nomeVariavel,
                    tipo: "integer",
                    categoria: "const",
                    nivel: escopo
                });
                break;
            }

            case 2: {
                //var
                tokensPilha.shift(); // Remove o token 'var'

                let i = 0;
                //enquanto houver tokens na pilha e o token for um identificador
                while (tokensPilha[i].token === 16) {
                    const idents = [];

                    //Equanto nao chegar no ";"
                    while (tokensPilha[i].token !== 31) {

                        //Guardo o nome do ident até chegar no ":".
                        if (tokensPilha[i].token === 16) {
                            idents.push(tokensPilha[i].lexema);
                        } else if (tokensPilha[i].token === 33) {
                            const tipo = tokensPilha[i + 1].lexema; // Tipagem dos identificadores

                            idents.map(ident => {
                                const simboloExistente = this.tabela_simbolos.find(item => item.nome === ident && item.nivel === escopo);
                                if (simboloExistente) {
                                    this.erros.push(`Linha ${tokensPilha[i].line}: variável '${ident}' já declarada.`);
                                    return;
                                }

                                this.tabela_simbolos.push({
                                    nome: ident,
                                    tipo: tipo,
                                    categoria: "var",
                                    nivel: escopo
                                });
                            })
                        }
                        i++;
                    }
                    i++; // Pula o token ";"
                }
                break;
            }

            case 16: {
                // Identificador

                const simbolo = this.tabela_simbolos.find(item => item.nome === tokenAtual.lexema && item.nivel === escopo);
                if (!simbolo) {
                    this.erros.push(`Linha ${tokenAtual.line}: identificador '${tokenAtual.lexema}' não declarado.`);
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