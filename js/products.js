// Preencha somente com números, no formato internacional: 55 + DDD + número.
// Exemplo: 5561999999999
const WHATSAPP_LOJA = "5561983808540";

const vitrine = document.querySelector("#produtos");
const pesquisa = document.querySelector("#pesquisa");
const categoria = document.querySelector("#categoria");

let catalogo = [];

function mostrarMensagem(texto) {
    vitrine.replaceChildren();

    const aviso = document.createElement("p");
    aviso.className = "catalogo-aviso";
    aviso.textContent = texto;
    vitrine.appendChild(aviso);
}

function criarCard(item) {
    const produto = document.createElement("article");
    produto.className = "produto";

    const imagem = document.createElement("img");
    imagem.src = encodeURI(item.imagem);
    imagem.alt = item.nome;
    imagem.loading = "lazy";
    imagem.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "produto-imagem-fallback";
        fallback.textContent = "Imagem indisponível";
        imagem.replaceWith(fallback);
    });

    const nome = document.createElement("h3");
    nome.textContent = item.nome;

    const whatsapp = document.createElement("a");
    whatsapp.className = "botao-whatsapp";
    whatsapp.textContent = "Consultar pelo WhatsApp";

    const mensagem = `Olá! Tenho interesse no produto: ${item.nome}`;

    if (/^\d+$/.test(WHATSAPP_LOJA)) {
        whatsapp.href = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
    } else {
        whatsapp.href = "#consulta-whatsapp";
        whatsapp.addEventListener("click", (event) => {
            event.preventDefault();
            window.alert("Preencha a constante WHATSAPP_LOJA em js/products.js com o número da loja (somente números).");
        });
    }

    produto.append(imagem, nome, whatsapp);
    return produto;
}

function mostrarProdutos(lista) {
    if (lista.length === 0) {
        mostrarMensagem("Nenhum produto encontrado");
        return;
    }

    vitrine.replaceChildren();
    lista.forEach((item) => {
        vitrine.appendChild(criarCard(item));
    });
}

function filtrarProdutos() {
    const termo = pesquisa.value.trim().toLowerCase();
    const tipo = categoria.value;

    const filtrados = catalogo.filter((item) => {
        const correspondeNome = item.nome.toLowerCase().includes(termo);
        const correspondeCategoria = tipo === "todas" || item.categoria === tipo;
        return correspondeNome && correspondeCategoria;
    });

    mostrarProdutos(filtrados);
}

async function carregarCatalogo() {
    mostrarMensagem("Carregando produtos...");

    try {
        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Resposta inválida ao carregar produtos.json");
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
            throw new Error("produtos.json não contém uma lista");
        }

        catalogo = dados;
        filtrarProdutos();
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar o catálogo. Confira se o site está aberto pelo Live Server.");
    }
}

if (vitrine && pesquisa && categoria) {
    pesquisa.addEventListener("input", filtrarProdutos);
    categoria.addEventListener("change", filtrarProdutos);
    carregarCatalogo();
}
