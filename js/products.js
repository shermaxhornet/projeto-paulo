const WHATSAPP_LOJA = "5561983808540";
const vitrine = document.querySelector("#produtos");
const pesquisa = document.querySelector("#pesquisa");
const categoria = document.querySelector("#categoria");
const marca = document.querySelector("#marca");
const contador = document.querySelector("#catalog-count");
let catalogo = [];
const galeriaDialogo = document.createElement("dialog");
galeriaDialogo.className = "gallery-dialog";
const galeriaFechar = document.createElement("button");
galeriaFechar.type = "button";
galeriaFechar.className = "gallery-close";
galeriaFechar.textContent = "Fechar";
galeriaFechar.setAttribute("aria-label", "Fechar galeria");
const galeriaAnterior = document.createElement("button");
galeriaAnterior.type = "button";
galeriaAnterior.className = "gallery-dialog-step";
galeriaAnterior.textContent = "‹";
galeriaAnterior.setAttribute("aria-label", "Foto anterior");
const galeriaProxima = document.createElement("button");
galeriaProxima.type = "button";
galeriaProxima.className = "gallery-dialog-step";
galeriaProxima.textContent = "›";
galeriaProxima.setAttribute("aria-label", "Próxima foto");
const galeriaImagem = document.createElement("img");
const galeriaPosicao = document.createElement("p");
galeriaPosicao.className = "gallery-dialog-position";
galeriaDialogo.append(galeriaFechar, galeriaAnterior, galeriaImagem, galeriaProxima, galeriaPosicao);
document.body.appendChild(galeriaDialogo);
let fotosAbertas = [];
let indiceFotoAberta = 0;
function atualizarFotoAberta() {
  galeriaImagem.src = encodeURI(fotosAbertas[indiceFotoAberta]);
  galeriaImagem.alt = "Foto " + (indiceFotoAberta + 1) + " de " + fotosAbertas.length;
  galeriaPosicao.textContent = (indiceFotoAberta + 1) + " / " + fotosAbertas.length;
}
function abrirGaleria(fotos, indice) {
  fotosAbertas = fotos;
  indiceFotoAberta = indice;
  atualizarFotoAberta();
  galeriaDialogo.showModal();
}
function moverFotoAberta(direcao) {
  indiceFotoAberta = (indiceFotoAberta + direcao + fotosAbertas.length) % fotosAbertas.length;
  atualizarFotoAberta();
}
galeriaFechar.addEventListener("click", () => galeriaDialogo.close());
galeriaAnterior.addEventListener("click", () => moverFotoAberta(-1));
galeriaProxima.addEventListener("click", () => moverFotoAberta(1));
galeriaDialogo.addEventListener("click", (evento) => {
  if (evento.target === galeriaDialogo) galeriaDialogo.close();
});

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
  const fotos = Array.isArray(item.imagens) && item.imagens.length ? item.imagens : [item.imagem];
  let fotoAtual = 0;
  imagem.src = encodeURI(fotos[fotoAtual]);
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
  if (fotos.length > 1) {
    const controles = document.createElement("div");
    controles.className = "gallery-controls";
    const posicao = document.createElement("span");
    posicao.className = "gallery-position";
    posicao.textContent = "1 / " + fotos.length;
    const anterior = document.createElement("button");
    anterior.type = "button";
    anterior.className = "gallery-step";
    anterior.textContent = "‹";
    anterior.setAttribute("aria-label", "Foto anterior");
    const proxima = document.createElement("button");
    proxima.type = "button";
    proxima.className = "gallery-step";
    proxima.textContent = "›";
    proxima.setAttribute("aria-label", "Próxima foto");
    const ampliar = document.createElement("button");
    ampliar.type = "button";
    ampliar.className = "gallery-open";
    ampliar.textContent = "Ver fotos";
    function selecionarFoto(indice) {
      fotoAtual = (indice + fotos.length) % fotos.length;
      imagem.src = encodeURI(fotos[fotoAtual]);
      imagem.alt = item.nome + " — foto " + (fotoAtual + 1) + " de " + fotos.length;
      posicao.textContent = (fotoAtual + 1) + " / " + fotos.length;
    }
    anterior.addEventListener("click", () => selecionarFoto(fotoAtual - 1));
    proxima.addEventListener("click", () => selecionarFoto(fotoAtual + 1));
    ampliar.addEventListener("click", () => abrirGaleria(fotos, fotoAtual));
    controles.append(anterior, posicao, proxima, ampliar);
    imagemArea.appendChild(controles);
  }

  const info = document.createElement("div");
  info.className = "product-info";
  const tipo = document.createElement("p");
  tipo.className = "product-category";
  tipo.textContent = item.categoria === "tenis" ? "Tênis" : item.categoria === "bolsas" ? "Bolsas" : item.categoria === "shorts" ? "Shorts" : item.categoria === "blusa-de-frio" ? "Blusa de frio" : item.categoria === "camisas" ? "Camisas" : "Blusas";
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
    const totalProdutos = document.querySelector('#total-products');
    if (totalProdutos) totalProdutos.textContent = String(catalogo.length);
    const categorias = [...new Set(catalogo.map((item) => item.categoria))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((item) => ({ value: item, label: item === "tenis" ? "Tênis" : item === "bolsas" ? "Bolsas" : item === "shorts" ? "Shorts" : item === "blusa-de-frio" ? "Blusa de frio" : item === "camisas" ? "Camisas" : item === "blusas" ? "Blusas" : item }));
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




