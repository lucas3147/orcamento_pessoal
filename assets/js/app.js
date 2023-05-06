class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    
    validarDados() {
        for(let i in this){
             if (this[i] == undefined || this[i] == null || this[i] == '') {
                return false
             }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', '0')
        }
    }

    getProximoId() {
        return parseInt(localStorage.getItem('id')) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let id = localStorage.getItem('id');
        let despesas = [];
        
        for (let i = 1; i <= id; i++) {
            if (localStorage.getItem(i) !== null) {
                let despesa = JSON.parse(localStorage.getItem(i))
                despesa.id = i;
                despesas.push(despesa);
            }
        }

        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = [];

        despesasFiltradas = this.recuperarTodosRegistros();

        if (despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        if (despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);    
        }
        if (despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);    
        }
        if (despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);    
        }
        if (despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);    
        }
        if (despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);    
        }

        return despesasFiltradas
    }

    removerDespesa(id) {
        localStorage.removeItem(id);
    }
 }

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia =  document.getElementById('dia')
    let tipo =  document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor =  document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value, 
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if (despesa.validarDados()) {
        bd.gravar(despesa)

        let modal = {};
        modal.titulo = 'Registro inserido';
        modal.customTitulo = 'modal-header text-success';
        modal.descricao = 'Despesa foi cadastrada com sucesso';
        modal.confirma = false;
        modal.descBotao = 'Voltar';
        modal.customBotao = 'btn btn-success';

        customizarModal(modal);

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        limparCampos();
    } else {

        let modal = {};
        modal.titulo = 'Erro na inclusão do registro';
        modal.customTitulo = 'modal-header text-danger';
        modal.descricao = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente';
        modal.confirma = false;
        modal.descBotao = 'Voltar';
        modal.customBotao = 'btn btn-danger';

        customizarModal(modal);

        //dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesas(despesasFiltradas) {
    limparCampos();

    let despesas = [];

    despesas = despesasFiltradas === undefined ? bd.recuperarTodosRegistros() : despesasFiltradas;
    
    var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = '';

    let tipo = document.getElementById('tipo');
    let qtdTipos = tipo.childElementCount;
    let descTipos = '';

    despesas.forEach((d) => {

        let linha = listaDespesas.insertRow();

        for (let i = 0; i < qtdTipos; i++) {
            if (d.tipo == tipo.options[i].value) {
                descTipos = tipo.options[i].text;
            }
        }

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linha.insertCell(1).innerHTML = descTipos;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        let btnExclusao = document.createElement('button');
        btnExclusao.className = 'btn btn-danger';
        btnExclusao.innerHTML = '<i class="fas fa-times"></i>';
        btnExclusao.id = `id_dispesa_${d.id}`;
        btnExclusao.onclick = () => {

            let modal = {};
            modal.titulo = 'Tem certeza?';
            modal.customTitulo = 'modal-header text-danger';
            modal.descricao = `Deseja excluir a despesa selecionada ?`;
            modal.confirma = true;
            modal.descBotao = 'Voltar';
            modal.customBotao = 'btn btn-danger';

            customizarModal(modal);

            //dialog de erro
            $('#modalRegistraDespesa').modal('show');

            bd.removerDespesa(this.id.replace('id_dispesa_', ''));
            window.location.reload();
        };
        linha.insertCell(4).append(btnExclusao);
    })
}

function limparCampos() {
    document.getElementById('ano').selectedIndex = 0;
    document.getElementById('mes').selectedIndex = 0;
    document.getElementById('dia').value = '';
    document.getElementById('tipo').selectedIndex = 0;
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesasFiltradas = [];
    
    despesasFiltradas = bd.pesquisar(despesa);

    carregaListaDespesas(despesasFiltradas);
}

function customizarModal(customModal) {
        document.getElementById('modal_titulo').innerHTML = customModal.titulo;
        document.getElementById('modal_titulo_div').className = customModal.customTitulo;
        document.getElementById('modal_conteudo').innerHTML = customModal.descricao;
        document.getElementById('btnConfirma').style.display = (customModal.confirma === true ? 'block' : 'none');
        document.getElementById('modal_btn').innerHTML = customModal.descBotao;
        document.getElementById('modal_btn').className = customModal.customBotao;
}