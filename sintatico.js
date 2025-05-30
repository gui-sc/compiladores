exports.producoes = {
    p1: [8, 16, 31, 46, 47, 35],
    p2: [48, 49, 50],
    p3: [21, 16, 26, 12, 31, 48],
    p4: [44],
    p5: [2, 52, 33, 53, 31, 54],
    p6: [16, 55],
    p7: [44],
    p8: [36, 16, 55],
    p9: [52, 33, 53, 31, 54],
    p10: [44],
    p11: [14],
    p12: [6],
    p13: [5],
    p14: [
    9,
        16,
        56,
        31,
        47,
        31,
        50,
    ],
    p15: [44],
    p16: [39,52, 33, 53, 57,38],
    p17: [44],
    p18: [36, 52, 33, 53, 57],
    p19: [44],
    p20: [22, 51, 18],
    p21: [58, 31, 51],
    p22: [44],
    p23: [10, 40, 59, 60, 41],
    p24: [61],
    p25: [44],
    p26: [36, 59, 60],
    p27: [62, 63],
    p28: [30, 62, 63],
    p29: [42, 62, 63],
    p30: [44],
    p31: [64, 65],
    p32: [37, 64, 65],
    p33: [34, 64, 65],
    p34: [44],
    p35: [39, 61, 38],
    p36: [16],
    p37: [12],
    p38: [11],
    p39: [13],
    p40: [23],
    p41: [15, 66, 4, 47, 67],
    p42: [61, 68, 61],
    p43: [26],
    p44: [27],
    p45: [29],
    p46: [25],
    p47: [28],
    p48: [24],
    p49: [19, 47],
    p50: [44],
    p51: [16, 69],
    p52: [17, 16, 32, 61, 3, 61, 20, 47],
    p53: [70],
    p54: [32, 61],
    p55: [39, 71, 72, 38],
    p56: [44],
    p57: [16],
    p58: [12],
    p59: [11],
    p60: [23],
    p61: [36, 71, 72],
    p62: [44],
    p63: [1, 66, 20, 47],
    p64: [7, 39, 16, 38],
    p65: [13],
};

exports.matrizParsing = {
    45: {
        1: "p1",
    },
    46: {
        2: "p2",
        21: "p2",
    },
    47: {
        22: "p20",
    },
    48: {
        2: "p4",
        21: "p3",
    },
    49: {
        2: "p5",
    },
    52: {
        2: "p5",
        16:"p6"
    },
    53: {
        5: "p13",
        6: "p12",
        14: "p11",
    },
    54: {
        9: "p10",
        16: "p9",
        22: "p10",
    },
    55: {
        33: "p7",
        36: "p8",
    },
    56: {
        31: "p17",
        39: "p16",
    },
    57: {
        36: "p18",
        38: "p19"
    },
    50: {
        9: "p14",
        22: "p15",
    },
    51: {
        1: "p21",
        7: "p21",
        10: "p21",
        15: "p21",
        16: "p21",
        17: "p21",
        18: "p22",
    },
    58: {
        1: "p63",
        7: "p64",
        10: "p23",
        15: "p41",
        16: "p51",
        17: "p52",
    },
    59: {
        11: "p24",
        12: "p24",
        13: "p24",
        16: "p24",
        23: "p24",
    },
    60: {
        36: "p26",
        39: "p27",
        41: "p25",
    },
    61: {
        11: "p27",
        12: "p27",
        13: "p27",
        16: "p27",
        23: "p27",
        39: "p31",
    },
    62: {
        11: "p31",
        12: "p31",
        13: "p31",
        16: "p31",
        23: "p31",
        38: "p30",
    },
    63: {
        3: "p30",
        4: "p30",
        20: "p30",
        24: "p30",
        25: "p30",
        26: "p30",
        27: "p30",
        28: "p30",
        29: "p30",
        30: "p28",
        31: "p30",
        36: "p30",
        39: "p35",
        42: "p29",
        41: "p30"
    },
    64: {
        11: "p38",
        12: "p37",
        13: "p39",
        16: "p36",
        23: "p40",
        38: "p34",
        42: "p34",
    },
    65: {
        3: "p34",
        4: "p34",
        20: "p34",
        24: "p34",
        25: "p34",
        26: "p34",
        27: "p34",
        28: "p34",
        29: "p34",
        30: "p34",
        31: "p34",
        34: "p33",
        36: "p34",
        37: "p32",
        39: "p42",
        41: "p34",   
        42: "p34"
    },
    66: {
        11: "p42",
        12: "p42",
        13: "p42",
        16: "p42",
        23: "p42",
    },
    67: {
        19: "p49",
        31: "p50",
    },
    68: {
        24: "p48",
        25: "p46",
        26: "p43",
        27: "p44",
        28: "p47",
        29: "p45",
        39: "p53",
    },
    69: {
        32: "p54",
        39: "p55",
    },
    70: {
        31: "p56",
    },
    71: {
        11: "p59",
        12: "p58",
        13: "p65",
        16: "p57",
        23: "p60",
    },
    72: {
        36: "p61",
        38: "p62",
    },
};


exports.parser = (tokens) => {
    const pilha = [43, ...this.producoes["p1"].reverse()];
    const entrada = [...tokens,{
        lexema: "$",
        token: 43,
        line: -1
    }];

    const derivacoes = [];
    const erros = [];
    let index = 1;
    while (pilha.length > 0) {
        const topo = pilha[pilha.length - 1];
        const tokenAtual = entrada[0];
        console.log(pilha)
        console.log(topo)
        console.log("tokenAtual", tokenAtual)
        if (!tokenAtual) {
            erros.push(`Erro: token inesperado no final da entrada.`);
            break;
        }

        if (topo === 43 && tokenAtual.token === -1) {
            pilha.pop();
            entrada.shift();
        } else if (!isNaN(Number(topo)) && Number(topo) === tokenAtual.token) {
            // Match terminal
            pilha.pop();
            entrada.shift();
        } else if (
            this.matrizParsing[topo] &&
            this.matrizParsing[topo][tokenAtual.token] !== undefined
        ) {
            // Não-terminal com entrada válida
            const prodIndex = this.matrizParsing[topo][tokenAtual.token];
            const producao = this.producoes[prodIndex];

            pilha.pop(); // remove o não-terminal

            if (producao[0] !== 44) {
                for (let i = producao.length - 1; i >= 0; i--) {
                    pilha.push(producao[i]);
                }
            }

            derivacoes.push(`${topo} → ${producao.join(" ")}`);
        } else if(topo == 44){
            pilha.pop()
        } else if(this.producoes[topo]){
            pilha.pop(); // remove o não-terminal
            const producao = this.producoes[topo]
            for (let i = producao.length - 1; i >= 0; i--) {
                pilha.push(producao[i]);
            }
            

            derivacoes.push(`${topo} → ${producao.join(" ")}`);
        } else {
            erros.push(
                `Erro sintático na linha ${tokenAtual.line}: inesperado '${tokenAtual.lexema}'`
            );
            break;
        }
        index++;
    }

    if (erros.length == 0) {
        console.log("\n✅ Análise sintática concluída com sucesso!");
    } else {
        console.log(erros)
        console.error("\n❌ Fim da pilha alcançado antes do fim da entrada.");
    }

    return { derivacoes, erros };
};
