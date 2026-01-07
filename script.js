// ===== LOGIN =====
function login() {
    const nome = document.getElementById("nome").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    if (!nome || !celular || !endereco) {
        alert("⚠️ Preencha todos os campos!");
        return;
    }

    const cliente = { nome, celular, endereco };
    localStorage.setItem("cliente", JSON.stringify(cliente));

    alert(`✅ Bem-vindo(a), ${nome}!`);
    location.href = "index.html";
}

// ===== CARRINHO =====
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Adicionar produto ao carrinho
function adicionarCarrinho(nome, preco) {
    const item = carrinho.find(p => p.nome === nome);

    if (item) item.qtd++;
    else carrinho.push({ nome, preco, qtd: 1 });

    salvarCarrinho();
    alert(`Produto "${nome}" adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removerDoCarrinho(nome) {
    const index = carrinho.findIndex(p => p.nome === nome);
    if (index > -1) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        carregarCarrinho();
        alert(`Produto "${nome}" removido do carrinho.`);
    }
}

// Salvar carrinho no localStorage e atualizar contador
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador();
}

// Atualiza o contador no ícone do carrinho
function atualizarContador() {
    const contador = document.getElementById("contador");
    if (contador) {
        contador.innerText = carrinho.reduce((s, p) => s + p.qtd, 0);
    }
}

// Carrega o carrinho na tela
function carregarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total");
    if (!lista || !totalEl) return;

    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach(p => {
        total += p.preco * p.qtd;
        lista.innerHTML += `
            <div class="item-carrinho">
                <span>${p.nome} (${p.qtd}x)</span>
                <span>R$ ${(p.preco * p.qtd).toFixed(2)}</span>
                <button class="remover" onclick="removerDoCarrinho('${p.nome}')">Remover</button>
            </div>`;
    });

    totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

// Inicializa contador ao carregar página
atualizarContador();

// ===== FINALIZAR PEDIDO (WhatsApp) =====
function enviarWhatsApp() {
    const cliente = JSON.parse(localStorage.getItem("cliente"));
    if (!cliente) {
        alert("⚠️ Faça o login antes de finalizar o pedido.");
        location.href = "login.html";
        return;
    }

    if (carrinho.length === 0) {
        alert("⚠️ Carrinho vazio!");
        return;
    }

    const pagamento = document.getElementById("pagamento")?.value;
    if (!pagamento) {
        alert("⚠️ Escolha a forma de pagamento!");
        return;
    }

    let total = 0;
    let produtos = "";

    carrinho.forEach(p => {
        total += p.preco * p.qtd;
        produtos += `${p.nome} (${p.qtd}x) - R$ ${(p.preco * p.qtd).toFixed(2)}\n`;
    });

    const mensagem =
`NOVO PEDIDO
Nome: ${cliente.nome}
Celular: ${cliente.celular}
Endereço: ${cliente.endereco}
Forma de pagamento: ${pagamento}
Produtos:
${produtos}
Total: R$ ${total.toFixed(2)}`;

    const telefoneDono = "5565996794384";
    const url = `https://wa.me/${telefoneDono}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}


// ===== FILTRAR PRODUTOS =====
function filtrarTodosProdutos() {
    const produtos = document.querySelectorAll('.produto');
    const texto = document.getElementById('campoPesquisa')?.value.toLowerCase() || "";

    produtos.forEach(produto => {
        const nome = produto.querySelector('h3')?.innerText.toLowerCase() || "";
        const generoProduto = produto.getAttribute('data-genero') || 'feminino';

        // Verifica filtro de gênero + pesquisa
        if ((generoAtual === 'todos' || generoProduto === generoAtual) && nome.includes(texto)) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }
    });
}

// ===== FILTRO DE GÊNERO =====
let generoAtual = 'todos';

function filtrarGenero(genero, botao) {
    generoAtual = genero.toLowerCase();

    // Atualiza título dinâmico conforme a página
    const titulo = document.getElementById('tituloFiltro');
    if (titulo) {
        // Verifica o tipo de página pelo body ou outro ID
        const tipoPagina = document.body.getAttribute('data-tipo') || 'perfumes';

        if (tipoPagina === 'perfumes') {
            if (generoAtual === 'feminino') titulo.innerHTML = "<center>Perfumes Femininos</center>";
            else if (generoAtual === 'masculino') titulo.innerHTML = "<center>Perfumes Masculinos</center>";
            else titulo.innerHTML = "<center>Perfumes Natura</center>";
        }

        if (tipoPagina === 'hidratantes') {
            if (generoAtual === 'feminino') titulo.innerHTML = "<center>Hidratantes Femininos</center>";
            else if (generoAtual === 'masculino') titulo.innerHTML = "<center>Hidratantes Masculinos</center>";
            else titulo.innerHTML = "<center>Hidratantes Natura</center>";
        }
    }

    // Marca botão ativo
    const botoes = botao.parentElement.querySelectorAll('button');
    botoes.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');

    filtrarTodosProdutos();
}

function filtrarLinha(linha) {
    const produtos = document.querySelectorAll('.produto');

    produtos.forEach(produto => {
        if (linha === 'todos' || produto.dataset.linha === linha) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }
    });
}

