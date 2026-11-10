const WHATSAPP_LOJA = "5561983808540";
const vitrine = document.querySelector("#produtos");
const pesquisa = document.querySelector("#pesquisa");
const categoria = document.querySelector("#categoria");
const marca = document.querySelector("#marca");
const contador = document.querySelector("#catalog-count");
let catalogo = [];

function mostrarMensagem(texto) {
  vitrine.replaceChildren();
  const mensagem = document.createElement("p");
  mensagem.className = "catalog-message";
  mensagem.textContent = texto;
  vitrine.appendChild(mensagem);
  vitrine.setAttribute("aria-busy", "false");
}

function criarCard(item) {
  const card = document.createElement("article");
  card.className = "product-card";
  const imagemArea = document.createElement("div");
  imagemArea.className = "product-image";
  const etiqueta = document.createElement("span");
  etiqueta.className = "product-label";
  etiqueta.textContent = item.marca;
  const imagem = document.createElement("img");
  imagem.src = encodeURI(item.imagem);
  imagem.alt = item.nome;
  imagem.loading = "lazy";
  imagem.decoding = "async";
  imagem.addEventListener("error", () => {
    imagemArea.replaceChildren();
    const fallback = document.createElement("span");
    fallback.className = "catalog-message";
    fallback.textContent = "Imagem indisponível";
    imagemArea.appendChild(fallback);
  }, { once: true });
  imagemArea.append(etiqueta, imagem);

  const info = document.createElement("div");
  info.className = "product-info";
  const tipo = document.createElement("p");
  tipo.className = "product-category";
  tipo.textContent = "Tênis";
  const nome = document.createElement("h3");
  nome.textContent = item.nome;
  const consultar = document.createElement("a");
  consultar.className = "product-action";
  consultar.textContent = "Consultar disponibilidade";
  const texto = "Olá! Tenho interesse no produto: " + item.nome + " (" + item.marca + ")";
  if (/^\d+$/.test(WHATSAPP_LOJA)) {
    consultar.href = "https://wa.me/" + WHATSAPP_LOJA + "?text=" + encodeURIComponent(texto);
    consultar.target = "_blank";
    consultar.rel = "noopener noreferrer";
  } else {
    consultar.href = "#sobre";
    consultar.setAttribute("aria-label", "Consulte a loja sobre " + item.nome);
  }
  const seta = document.createElement("span");
  seta.setAttribute("aria-hidden", "true");
  seta.textContent = "↗";
  consultar.appendChild(seta);
  info.append(tipo, nome, consultar);
  card.append(imagemArea, info);
  return card;
}

function mostrarProdutos(lista) {
  contador.textContent = lista.length + " " + (lista.length === 1 ? "modelo" : "modelos");
  if (!lista.length) {
    mostrarMensagem("Nenhum modelo encontrado. Tente outro termo ou filtro.");
    return;
  }
  vitrine.replaceChildren(...lista.map(criarCard));
  vitrine.setAttribute("aria-busy", "false");
}

function filtrarProdutos() {
  const termo = pesquisa.value.trim().toLocaleLowerCase("pt-BR");
  const tipo = categoria.value;
  const marcaSelecionada = marca.value;
  const filtrados = catalogo.filter((item) => {
    const nome = item.nome.toLocaleLowerCase("pt-BR");
    const nomeMarca = item.marca.toLocaleLowerCase("pt-BR");
    const correspondeBusca = nome.includes(termo) || nomeMarca.includes(termo);
    const correspondeCategoria = tipo === "todas" || item.categoria === tipo;
    const correspondeMarca = marcaSelecionada === "todas" || item.marca === marcaSelecionada;
    return correspondeBusca && correspondeCategoria && correspondeMarca;
  });
  mostrarProdutos(filtrados);
}

function preencherFiltro(seletor, valores) {
  for (const item of valores) {
    const opcao = document.createElement("option");
    opcao.value = item.value;
    opcao.textContent = item.label;
    seletor.appendChild(opcao);
  }
}

async function carregarCatalogo() {
  try {
    const resposta = await fetch("data/products.json");
    if (!resposta.ok) throw new Error("Não foi possível carregar o catálogo.");
    const dados = await resposta.json();
    if (!Array.isArray(dados)) throw new Error("O catálogo precisa ser uma lista.");
    catalogo = dados.filter((item) => item && item.nome && item.imagem && item.categoria && item.marca);
    const categorias = [...new Set(catalogo.map((item) => item.categoria))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((item) => ({ value: item, label: item === "tenis" ? "Tênis" : item }));
    const marcas = [...new Set(catalogo.map((item) => item.marca))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((item) => ({ value: item, label: item }));
    preencherFiltro(categoria, categorias);
    preencherFiltro(marca, marcas);
    filtrarProdutos();
  } catch {
    contador.textContent = "Catálogo indisponível";
    mostrarMensagem("Não foi possível carregar os produtos. Abra a loja por um servidor local, como o Live Server do VS Code.");
  }
}

if (vitrine && pesquisa && categoria && marca && contador) {
  pesquisa.addEventListener("input", filtrarProdutos);
  categoria.addEventListener("change", filtrarProdutos);
  marca.addEventListener("change", filtrarProdutos);
  const ano = document.querySelector("#current-year");
  if (ano) ano.textContent = new Date().getFullYear();
  carregarCatalogo();
}
