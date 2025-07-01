class AnalisadorSemantico {

    constructor() {
        this.tabela_simbolos = [];
        this.erros = [];
        this.tokensParada = [";", "to", "do", "then", ","];

        this.operadoresLogicos = [
            "<",
            ">",
            "=",
            "<=",
            ">=",
            "<>",
        ];

        this.todosOperadores = [
            ...this.operadoresLogicos,
            "+",
            "-",
            "*",
            "/"
        ];
    }

    //Função que ajuda a tipar um identificador com base no valor atribuido
    extrairTipo(token) {
        const tabelaTipos = {
            11: "real", //nreal
            12: "integer", //nint
            23: "string" //vstring
        }
        return tabelaTipos[token];
    }

    //Função que busca um simbolo na tabela de simbolos
    getSimbolo(nome, nivel = "global") {
        return this.tabela_simbolos.find(item => (item.nome === nome && item.nivel === nivel) ||
            (item.nome === nome &&
                item.nivel === "global" &&
                item.categoria === "procedure"));
    }

    acaoSemantica(tokenAtual, entrada, escopo, tokenAnterior) {
        const tokensPilha = [...entrada] //Evita referência circular
        //console.log("Tokens na pilha:", tokensPilha);

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
                //enquanto o token for um identificador
                while (tokensPilha[i].token === 16) {
                    const idents = [];

                    //Equanto nao chegar no ";"
                    while (tokensPilha[i].token !== 31) {

                        //Guardo o nome do ident até chegar no ":".
                        if (tokensPilha[i].token === 16) {
                            idents.push(tokensPilha[i].lexema);
                        } else if (tokensPilha[i].token === 33) {
                            const tipo = tokensPilha[i + 1].lexema; // Tipagem dos identificadores

                            idents.forEach(ident => {
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
                const isChamadaProcedure = simbolo.categoria === "procedure" && tokenAnterior.token !== 9;
                const isOperacao = this.todosOperadores.includes(tokensPilha[1].lexema);

                let valorAtribuido = tokensPilha[2];

                // Verifica se é uma atribuição (":=")
                if (isAtribuicao) {

                    if (simbolo.categoria === "const") {
                        this.erros.push(`Linha ${tokenAtual.line}: não é possível sobrescrever a constante '${simbolo.nome}'.`);
                        return;
                    } else if (simbolo.categoria === "procedure") {
                        this.erros.push(`Linha ${tokenAtual.line}: não é possível atribuir um valor a uma procedure.`);
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

                    } else { // O valor atribuído é literal (ex: 10, "teste", 1.99)

                        let i = 0;
                        while (![";", "to"].includes(tokensPilha[i].lexema)) {
                            valorAtribuido = tokensPilha[i];
                            const tipoLiteral = this.extrairTipo(valorAtribuido.token);

                            // Se não for um operador e o tipo atribuido for diferente do tipo da variavel
                            if (tipoLiteral && simbolo.tipo !== tipoLiteral) {
                                this.erros.push(`Linha ${tokenAtual.line}: não pode-se atribuir um ${tipoLiteral} ao tipo ${simbolo.tipo}.`);
                                return;
                            }
                            i++;
                        }
                    }
                }
                else if (isOperacao) {
                    this.tratarOperacoes(tokensPilha, escopo);
                }
                else if (isChamadaProcedure) {
                    // Se o proximo token é ( e parametros.length == 0, erro.
                    //Se o proximo token não é "(", e parametros.length > 0, erro.
                    //Depois, while para percorrer os parametros passados na chamada da procedure.
                    //Se parametros.length != simbolo.parametros.length, erro.
                    //Se algum parametro for do tipo errado, erro.
                }

                break;
            }

            case 11: { //nreal
                this.tratarOperacoes(tokensPilha);
                break;
            }

            case 12: { //nint
                this.tratarOperacoes(tokensPilha);

                break;
            }

            case 23: { //vstring
                const proximoToken = tokensPilha[1];

                if (this.todosOperadores.includes(proximoToken.lexema)) {
                    this.erros.push(`Linha ${tokenAtual.line}: não pode fazer operações lógicas ou aritméticas com string`);
                }
                break;
            }

            case 1: { //while
                let i = 0;
                while (tokensPilha[i].lexema !== "do") {
                    if (this.operadoresLogicos.includes(tokensPilha[i].lexema)) {
                        return;
                    }
                    i++;
                }
                this.erros.push(`Linha ${tokenAtual.line}: o laço while deve conter uma expressão de parada`);
                break;
            }

            case 9: { //procedure
                tokensPilha.shift(); // Remove o token 'procedure'
                const nomeProcedure = tokensPilha[0].lexema;

                const simboloExistente = this.getSimbolo(nomeProcedure);
                if (simboloExistente) {
                    this.erros.push(`Linha ${tokenAtual.line}: procedure '${nomeProcedure}' já declarada.`);
                    return;
                }

                let i = 0;

                tokensPilha.shift(); // Remove o nome da procedure

                const tiposParametros = [];
                let idents = [];
                while (tokensPilha[i].lexema !== ")") {
                    console.log("WHILE ATUAL", tokensPilha[i].lexema);

                    if (tokensPilha[i].token === 16) {
                        //Guardo o nome do ident até chegar no ":".
                        idents.push(tokensPilha[i].lexema);

                    } else if (tokensPilha[i].token === 33) {
                        const tipo = tokensPilha[i + 1].lexema; // Tipagem dos identificadores

                        idents.forEach(ident => {
                            const simboloExistente = this.getSimbolo(ident, nomeProcedure);
                            if (simboloExistente) {
                                this.erros.push(`Linha ${tokensPilha[i].line}: variável '${ident}' já declarada.`);
                                return;
                            }
                            tiposParametros.push(tipo);

                            this.tabela_simbolos.push({
                                nome: ident,
                                tipo: tipo,
                                categoria: "parametro",
                                nivel: nomeProcedure
                            });
                        })
                        idents = []; // Limpa a lista de identificadores
                    }
                    i++;
                }

                this.tabela_simbolos.push({
                    nome: nomeProcedure,
                    tipo: "procedure",
                    categoria: "procedure",
                    parametros: tiposParametros,
                    nivel: "global"
                });
                break;
            }

            default:
                break;
        }
    }

    tratarOperacoes(tokensPilha, escopo) {
        const topo = tokensPilha.shift(); //Remove o topo

        let i = 0;
        let tokenAtual = tokensPilha[i];

        if (topo.token === 16) {
            const simboloTopo = this.getSimbolo(topo.lexema, escopo);
            if (simboloTopo.tipo === "string") {
                this.erros.push(`Linha ${tokenAtual.line}: não pode fazer operações lógicas ou aritméticas com string`);
            }
        }

        while (!this.tokensParada.includes(tokenAtual.lexema)) {

            let proximoIsString = false;
            let proximoToken = tokensPilha[i + 1];

            if (proximoToken.token === 16) {
                const simbolo = this.getSimbolo(proximoToken.lexema);
                if (simbolo.tipo === "string") {
                    proximoIsString = true;
                }
            } else if (proximoToken.token === 23) {
                proximoIsString = true;
            }

            if (proximoIsString) {
                this.erros.push(`Linha ${tokenAtual.line}: não pode fazer operações lógicas ou aritméticas com string`);
            }
            i++;
            tokenAtual = tokensPilha[i + 1];
        }
    }
}

module.exports = AnalisadorSemantico;