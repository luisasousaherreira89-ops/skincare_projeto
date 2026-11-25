const CHAVE_STORAGE = "produtos_ifsp";

document.addEventListener("DOMContentLoaded", function() {
    gerarNovoCodigo();
    atualizarTabela();
});


function obterProdutos() {
    let dados = localStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
}


function gravarProdutos(produtos) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(produtos));
}


function gerarCodigoAleatorio() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
    for (let i = 0; i < 4; i++) {
        let indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }
    return codigo;
}

function gerarNovoCodigo() {
    let produtos = obterProdutos();
    let codigo;
    do {
        codigo = gerarCodigoAleatorio();
    } while (produtos.some(p => p.codigo === codigo));

    document.getElementById("codigo").value = codigo;
}


document.getElementById("foto").addEventListener("input", function() {
    let nomeFoto = this.value.trim();
    let imgPreview = document.getElementById("previewFoto");

    if (nomeFoto !== "") {
        imgPreview.src = "imgs/" + nomeFoto + ".jpeg";
        imgPreview.style.display = "block";
    } else {
        imgPreview.style.display = "none";
        imgPreview.src = "";
    }
});


document.getElementById("formProduto").addEventListener("submit", function(e) {
    e.preventDefault();

    let codigo = document.getElementById("codigo").value;
    let produtoNome = document.getElementById("produto").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let precoStr = document.getElementById("preco").value.trim().replace(",", ".");
    let foto = document.getElementById("foto").value.trim();

    if (!codigo || !produtoNome || !descricao || !precoStr || !foto) {
        alert("Erro: Nenhum dos campos poderá ser vazio!");
        return;
    }

    
    if (produtoNome.length < 5) {
        alert("Erro: O nome do produto deve ter no mínimo 5 caracteres!");
        return;
    }

  
    if (isNaN(precoStr) || Number(precoStr) <= 0) {
        alert("Erro: O preço deve conter apenas números válidos!");
        return;
    }

    if (foto.length > 10) {
        alert("Erro: O nome da foto deve ter no máximo 10 caracteres!");
        return;
    }

    let produtos = obterProdutos();
    let indice = produtos.findIndex(p => p.codigo === codigo);

    let dadosProduto = {
        codigo: codigo,
        produto: produtoNome,
        descricao: descricao,
        preco: Number(precoStr).toFixed(2),
        foto: foto
    };

    if (indice >= 0) {
     
        produtos[indice] = dadosProduto;
        alert("Alterações salvas com sucesso!");
    } else {
       
        produtos.push(dadosProduto);
        alert("Produto cadastrado com sucesso!");
    }

    gravarProdutos(produtos);
    atualizarTabela();
    limparEVoltarCadastro();
});


function atualizarTabela() {
    let produtos = obterProdutos();
    let container = document.getElementById("tabelaProdutosContainer");
    container.innerHTML = "";

    if (produtos.length === 0) {
        container.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;
    }

    let tabela = document.createElement("table");
    tabela.innerHTML = `
        <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Descrição</th>
            <th>Ações</th>
        </tr>
    `;

    produtos.forEach(function(item) {
        let linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.produto}</td>
            <td>${item.descricao}</td>
            <td>
                <button class="btn-tabela btn-editar" onclick="carregarParaEditar('${item.codigo}')">Editar</button>
                <button class="btn-tabela btn-excluir" onclick="solicitarExclusao('${item.codigo}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });

    container.appendChild(tabela);
}


function carregarParaEditar(codigo) {
    let produtos = obterProdutos();
    let produto = produtos.find(p => p.codigo === codigo);

    if (produto) {
        document.getElementById("codigo").value = produto.codigo;
        document.getElementById("produto").value = produto.produto;
        document.getElementById("descricao").value = produto.descricao;
        document.getElementById("preco").value = produto.preco;
        document.getElementById("foto").value = produto.foto;

        let imgPreview = document.getElementById("previewFoto");
        imgPreview.src = "imagens/" + produto.foto + ".jpg";
        imgPreview.style.display = "block";

     
        document.getElementById("tituloTela").textContent = "ALTERAÇÃO DE PRODUTO";
        document.getElementById("btnSalvar").textContent = "Salvar alterações";

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function solicitarExclusao(codigo) {
    let produtos = obterProdutos();
    let produto = produtos.find(p => p.codigo === codigo);

    if (produto) {
        let mensagem = "Deseja excluir o produto?\n\n" +
                       "Código: " + produto.codigo + "\n" +
                       "Produto: " + produto.produto + "\n" +
                       "Descrição: " + produto.descricao + "\n" +
                       "Preço: R$ " + produto.preco.replace(".", ",");

        let confirmar = confirm(mensagem);

        if (confirmar) {
          
            produtos = produtos.filter(p => p.codigo !== codigo);
            gravarProdutos(produtos);
            atualizarTabela();
            limparEVoltarCadastro();
        }
      
    }
}


function limparEVoltarCadastro() {
    document.getElementById("formProduto").reset();
    document.getElementById("tituloTela").textContent = "CADASTRO DE PRODUTOS";
    document.getElementById("btnSalvar").textContent = "Cadastrar Produto";
    document.getElementById("previewFoto").style.display = "none";
    document.getElementById("previewFoto").src = "";
    gerarNovoCodigo();
}


document.getElementById("btnCancelar").addEventListener("click", function() {
    limparEVoltarCadastro();
});