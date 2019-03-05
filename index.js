$(document).ready(function(){
    $('.peso').mask("000.0", {reverse: true});
    $('.altura').mask("0.00");
    $('.idade').mask("000");
})

var controleDeCampos = (function(){
    var iptNome = document.querySelector('#ipt-nome');
    var iptPesoAtual = document.querySelector('#ipt-peso-atual');
    var iptAltura = document.querySelector('#ipt-altura');
    var iptPesoDesejado = document.querySelector('#ipt-peso-desejado');
    var iptAtividadeFisica = document.querySelector('#ipt-atividade-fisica');
    var iptIdade = document.querySelector('#ipt-idade');
    var iptSexo = document.querySelector('#ipt-sexo');
    var btnCalcular = document.querySelector('#btn-calcular');

    function myTrim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }

    function verificarCamposPreenchidos(){
        if (myTrim(iptNome.value) == '' || iptPesoAtual.value == '' || iptPesoAtual.value == 0 || iptAltura.value == '' || iptAltura.value == 0 || iptPesoDesejado.value == '' || iptPesoDesejado.value == 0 || iptAtividadeFisica.value == '' || iptIdade.value == "" || iptIdade.value == 0 || iptSexo.value == "") {
            btnCalcular.disabled = true;
        } else {
            btnCalcular.disabled = false;
        }
    }
    
    return{
        verificarCamposPreenchidos: verificarCamposPreenchidos
    }
})();

var calculos = (function(){
    var ipt = {
        nome: document.querySelector('#ipt-nome'),
        pesoAtual: document.querySelector('#ipt-peso-atual'),
        altura: document.querySelector('#ipt-altura'),
        pesoDesejado: document.querySelector('#ipt-peso-desejado'),
        atividadeFisica: document.querySelector('#ipt-atividade-fisica'),
        sexo: document.querySelector('#ipt-sexo'),
        idade: document.querySelector('#ipt-idade')
    }
    var conteudoCards = {
        objetivo: document.querySelector('#conteudo-card-objetivo'),
        tempoParaObjetivo: document.querySelector('#conteudo-card-tempo-objetivo'),
        objetivoConsumo: document.querySelector('#conteudo-card-objetivo-consumo'),
        calorias: document.querySelector('#conteudo-card-calorias'),
        macros: document.querySelector('#conteudo-card-macros'),
        imc: document.querySelector('#conteudo-card-IMC')
    }

    var macros = {
        proteinas: "",
        carboidratos: "",
        gorduras: "",
        fibras: ""
    }

    var btnCalcular = document.querySelector('#btn-calcular');

    var topBar = document.querySelector('#nome')

    var desejo = "";

    var tempoParaObjetivo = "";

    var metabolismoBasal = "";

    var consumoExercicios = "";

    var consumoDiario = "";

    var consumoObjetivo= "";

    var diferencaConsumoSemana = "";
    
    var distanciaObjetivo = "";

    var imc = "";

    btnCalcular.addEventListener("click", function(){
        alterarTopBar();
        calcularDados();
        limparCards();
        preencherCards();
        limparCampo();
    })

    function limparCampo(){
        ipt.nome.value = "";
        ipt.pesoAtual.value = "";
        ipt.altura.value = "";
        ipt.pesoDesejado.value = "";
        ipt.idade.value = "";
        ipt.sexo.value = "f";
        ipt.atividadeFisica.value = 1;
        btnCalcular.disabled = true;
    }

    function alterarTopBar(){
        if(ipt.sexo.value == "f"){
            topBar.textContent = "";
            topBar.textContent = "Bem Vinda " + ipt.nome.value + "!";
        }
        else{
            topBar.textContent = "";
            topBar.textContent = "Bem Vindo " + ipt.nome.value + "!";
        }
    }

    function calcularDados(){
        ganharOuPerder();
        atribuirDistanciaObjetivo();
        calcularMetabolismoBasal();
        atribuiValorConsumoExercicios();
        atribuiValorConsumoDiario();
        atribuirConsumoObjetivo();
        calcularMacros();
        calcularImc();
        atribuirTempoParaObjetivo();
        atribuirDiferencaConsumoSemana();
    }

    function preencherCards(){
        preencherCardObjetivo();
        preencherCardTempoParaObjetivo();
        preencherCardObjetivoConsumo();
        preencherCardCalorias();
        preencherCardMacros();
        preencherCardImc();
    }

    function preencherCardObjetivo(){
        if (desejo == "p") {
            var p = document.createElement("p");
            p.textContent= 'Perder ' + distanciaObjetivo + 'Kg.';
            conteudoCards.objetivo.appendChild(p);
        } else if(desejo == "g") {
            var p = document.createElement("p");
            p.textContent= 'Ganhar ' + distanciaObjetivo + 'Kg.';
            conteudoCards.objetivo.appendChild(p);
        }
        else{
            alert("Ops, aconteceu um erro.");
        }
    }

    function preencherCardObjetivoConsumo(){
        if (desejo == "p") {
            var p = document.createElement("p");
            p.textContent= consumoObjetivo + 'Kcal diárias.';
            conteudoCards.objetivoConsumo.appendChild(p);
        } else if(desejo == "g") {
            var p = document.createElement("p");
            p.textContent= consumoObjetivo + 'Kcal diárias.';
            conteudoCards.objetivoConsumo.appendChild(p);
        }
        else{
            alert("Ops, aconteceu um erro.");
        }
    }

    function preencherCardTempoParaObjetivo(){
        var p = document.createElement("p");
        p.textContent= tempoParaObjetivo + ' dias para o objetivo!';
        conteudoCards.tempoParaObjetivo.appendChild(p);
    }

    function preencherCardCalorias(){
        if (desejo=="p") {
            var p = document.createElement("p");
            p.textContent="Você deixa de consumir " + diferencaConsumoSemana + "Kcal por semana!"
            conteudoCards.calorias.appendChild(p);
        } else {
            var p = document.createElement("p");
            p.textContent="Você consome " + diferencaConsumoSemana + "Kcal a mais por semana!"
            conteudoCards.calorias.appendChild(p);
        }
    }

    function atribuirDiferencaConsumoSemana(){
        var diferencaConsumoDia = "";
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            diferencaConsumoDia = consumoDiario - consumoObjetivo;
            diferencaConsumoSemana = diferencaConsumoDia*7;
            diferencaConsumoSemana = Math.ceil(diferencaConsumoSemana);
        } else {
            diferencaConsumoDia = consumoObjetivo - consumoDiario;
            diferencaConsumoSemana = diferencaConsumoDia*7;
            diferencaConsumoSemana = Math.ceil(diferencaConsumoSemana);
        }
    }

    function atribuirTempoParaObjetivo(){
        var diferencaConsumoDia = "";
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            diferencaConsumoDia = consumoDiario - consumoObjetivo;
        } else {
            diferencaConsumoDia = consumoObjetivo - consumoDiario;
        }
        var distanciaObjetivoGramas = distanciaObjetivo*1000;
        var distanciaKcal = distanciaObjetivoGramas*7;
        tempoParaObjetivo = distanciaKcal/diferencaConsumoDia;
        tempoParaObjetivo = Math.ceil(tempoParaObjetivo);
    }

    function preencherCardMacros(){
        var pProteina = document.createElement('p');
        var pCarboidrato = document.createElement('p');
        var pGordura = document.createElement('p');
        var pFibra = document.createElement('p');
        pProteina.textContent = "Proteínas: " + macros.proteinas + "g";
        pCarboidrato.textContent = "Carboidratos: " + macros.carboidratos + "g";
        pGordura.textContent = "Gorduras: " + macros.gorduras + "g";
        pFibra.textContent = "Fibras: " + macros.fibras + "g";
        conteudoCards.macros.appendChild(pProteina);
        conteudoCards.macros.appendChild(pCarboidrato);
        conteudoCards.macros.appendChild(pGordura);
        conteudoCards.macros.appendChild(pFibra);
    }

    function preencherCardImc(){
        var p = document.createElement('p');
        p.textContent = "Seu IMC atual é " + imc;
        conteudoCards.imc.appendChild(p);
    }

    function limparCards(){
        conteudoCards.objetivo.innerHTML="";
        conteudoCards.tempoParaObjetivo.innerHTML="";
        conteudoCards.objetivoConsumo.innerHTML="";
        conteudoCards.calorias.innerHTML="";
        conteudoCards.macros.innerHTML="";
        conteudoCards.imc.innerHTML="";
    }

    function atribuirDistanciaObjetivo(){
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            distanciaObjetivo = ipt.pesoAtual.value - ipt.pesoDesejado.value;
        } else {
            distanciaObjetivo = ipt.pesoDesejado.value - ipt.pesoAtual.value;         
        }
    }

    function atribuiValorConsumoExercicios(){
        if (ipt.atividadeFisica.value == 1) {
            consumoExercicios = 0;
        } else if(ipt.atividadeFisica.value == 2) {
            consumoExercicios = 750;
        } else if(ipt.atividadeFisica.value == 3){
            consumoExercicios = 1850;
        } else if(ipt.atividadeFisica.value == 4){
            consumoExercicios = 3750;
        } else if(ipt.atividadeFisica.value == 5){
            consumoExercicios = 5000;
        }
    }

    function atribuiValorConsumoDiario(){
        var exercicioDia = consumoExercicios/7;
        consumoDiario = metabolismoBasal + exercicioDia;
    }

    function calcularMetabolismoBasal(){
        if (ipt.sexo.value == 'f') {
            metabolismoBasal = 665 + (9.6 * ipt.pesoAtual.value) + (1.8 * ipt.altura.value * 100) - (4.7 * ipt.idade.value);
        } else {
            metabolismoBasal = 66 + (13.7 * ipt.pesoAtual.value) + (5 * ipt.altura.value * 100) - (6.8 * ipt.idade.value);
        }
    }

    function calcularMacros(){
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            macros.proteinas = consumoObjetivo*0.5/4;
            macros.carboidratos = consumoObjetivo*0.3/4;
            macros.gorduras = consumoObjetivo*0.18/9;
            macros.fibras = consumoObjetivo*0.02/2;
            macros.proteinas = Math.ceil(macros.proteinas);
            macros.carboidratos = Math.ceil(macros.carboidratos);
            macros.gorduras = Math.ceil(macros.gorduras);
            macros.fibras = Math.ceil(macros.fibras);
        } else {
            macros.proteinas = consumoObjetivo*0.45/4;
            macros.carboidratos = consumoObjetivo*0.35/4;
            macros.gorduras = consumoObjetivo*0.18/9;
            macros.fibras = consumoObjetivo*0.02/2;   
            macros.proteinas = Math.ceil(macros.proteinas);
            macros.carboidratos = Math.ceil(macros.carboidratos);
            macros.gorduras = Math.ceil(macros.gorduras);
            macros.fibras = Math.ceil(macros.fibras);     
        }
    }

    function atribuirConsumoObjetivo(){
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            consumoObjetivo = consumoDiario*0.75;
            consumoObjetivo = Math.ceil(consumoObjetivo);
        } else{
            consumoObjetivo = consumoDiario*1.25;
            consumoObjetivo = Math.ceil(consumoObjetivo);
        }
    }

    function calcularImc(){
        var alturaQuadrado = ipt.altura.value*ipt.altura.value;
        imc = ipt.pesoAtual.value/alturaQuadrado;
        imc = imc.toFixed(2);
    }

    function ganharOuPerder(){
        if ((ipt.pesoAtual.value - ipt.pesoDesejado.value) > 0) {
            desejo = "p";
        } else {
            desejo = "g";            
        }
    }

})();