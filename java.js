const WHATSAPP = "5561983808540";

const catalogo = [
    {
        id: "FEN-000001",
        nome: "Camisa Brasil 2026",
        categoria: "selecoes",
        imagem: "img/camisas/brasil-frente.webp",
        imagem2: "img/camisas/brasil-costas.webp"
    },
    {
        id: "FEN-000002",
        nome: "Camisa Real Madrid 2026",
        categoria: "clubes",
        imagem: "img/camisas/real-frente.webp",
        imagem2: "img/camisas/real-costas.webp"
    },
    {
        id: "TEN-000001",
        nome: "Tênis Adidas",
        categoria: "tenis",
        imagem: "img/tenis/adidas.webp"
    },
    {
        id: "BOL-000001",
        nome: "Bolsa Feminina Preta",
        categoria: "bolsas",
        imagem: "img/bolsas/bolsa-preta.webp"
    }
];

const vitrine = document.querySelector("#produtos");
const pesquisa = document.querySelector("#pesquisa");
const categoria = document.querySelector("#categoria");

function mostrarProdutos(lista) {
    vitrine.innerHTML = "";

    lista.forEach(item => {
        const produto = document.createElement("article");
        produto.className = "produto";

        let mostrandoFrente = true;

        const imagem = document.createElement("img");
        imagem.src = item.imagem;
        imagem.alt = item.nome;
        imagem.loading = "lazy";

        const nome = document.createElement("h3");
        nome.textContent = item.nome;

        produto.appendChild(imagem);
        produto.appendChild(nome);

        // Alternar fotos, quando houver duas
        if (item.imagem2) {
            const botaoFoto = document.createElement("button");
            botaoFoto.textContent = "Ver costas";

            botaoFoto.addEventListener("click", () => {
                mostrandoFrente = !mostrandoFrente;

                imagem.src = mostrandoFrente
                    ? item.imagem
                    : item.imagem2;

                botaoFoto.textContent = mostrandoFrente
                    ? "Ver costas"
                    : "Ver frente";
            });

            produto.appendChild(botaoFoto);
        }

        // Botão de WhatsApp
        const whatsapp = document.createElement("a");

        const mensagem = `Olá! Tenho interesse no produto: ${item.nome}`;

        whatsapp.href =
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
        whatsapp.className = "botao-whatsapp";
        whatsapp.textContent = "Comprar pelo WhatsApp";

        produto.appendChild(whatsapp);

        vitrine.appendChild(produto);
    });
}

function filtrarProdutos() {
    const termo = pesquisa.value.toLowerCase();
    const tipo = categoria.value;

    const filtrados = catalogo.filter(item => {
        const correspondeNome =
            item.nome.toLowerCase().includes(termo);

        const correspondeCategoria =
            tipo === "todas" || item.categoria === tipo;

        return correspondeNome && correspondeCategoria;
    });

    mostrarProdutos(filtrados);
}

pesquisa.addEventListener("input", filtrarProdutos);
categoria.addEventListener("change", filtrarProdutos);

mostrarProdutos(catalogo);