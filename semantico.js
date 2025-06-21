class AnalisadorSemantico {

    constructor() {
        this.tabela_simbolos = [];
        this.erros = [];
    }

    //Função que ajuda a comparar os tipos de dois idents.
    extrairTipo(token) {
        const tabelaTipos = {
            11: "real", //nreal
            12: "integer", //nint
            23: "string" //vstring
        }
        return tabelaTipos[token];
    }

    getSimbolo(nome, nivel = "global") {
        return this.tabela_simbolos.find(item => item.nome === nome && item.nivel === nivel)
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
                const simboloExistente = this.getSimbolo(nomeVariavel);
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
                                const simboloExistente = this.getSimbolo(ident, escopo);
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

            case 16: { // Identificador
                const simbolo = this.getSimbolo(tokenAtual.lexema, escopo);

                if (!simbolo) {
                    this.erros.push(`Linha ${tokenAtual.line}: identificador '${tokenAtual.lexema}' não declarado.`);
                    return;
                }

                const isAtribuicao = tokensPilha[1].lexema === ":=";
                const valorAtribuido = tokensPilha[2];

                // Verifica se é uma atribuição (":=")
                if (isAtribuicao) {

                    if (simbolo.categoria === "const") {
                        this.erros.push(`Linha ${tokenAtual.line}: não é possível sobrescrever a constante '${simbolo.nome}'.`);
                        return;
                    }

                    // Se o valor atribuído seja outro identificador
                    if (valorAtribuido.token === 16) {
                        const ident = this.getSimbolo(valorAtribuido.lexema, escopo);

                        if (!ident) {
                            this.erros.push(`Linha ${tokenAtual.line}: identificador '${valorAtribuido.lexema}' não declarado.`);
                            return;
                        }

                        if (simbolo.tipo !== ident.tipo) {
                            this.erros.push(`Linha ${tokenAtual.line}: não pode-se atribuir um ${ident.tipo} ao tipo ${simbolo.tipo}.`);
                            return;
                        }

                    } else {
                        // O valor atribuído é literal (ex: 10, "teste", 1.99)
                        const tipoLiteral = this.extrairTipo(valorAtribuido.token);

                        if (simbolo.tipo !== tipoLiteral) {
                            this.erros.push(`Linha ${tokenAtual.line}: não pode-se atribuir um ${tipoLiteral} ao tipo ${simbolo.tipo}.`);
                            return;
                        }
                    }
                }

                break;
            }


            default:
                break;
        }
    }
}

module.exports = AnalisadorSemantico;