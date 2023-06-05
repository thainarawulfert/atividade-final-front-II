window.onload = () => {
  loadPagina("/character/?page=1");
  contagemApi();
};

let informacoes;
let anteriorPagina = null;
let proximaPagina = null;

const urlPrincipal = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

function loadPagina(url, buscar = "") {
  const buscarNome = buscar ? `&name= ${buscar}` : "";
  urlPrincipal.get(url + buscarNome).then((res) => {
    const personagem = res.data;
    anteriorPagina = res.data.info.prev;
    proximaPagina = res.data.info.next;
    mostrarPersonagem(personagem);
  });
}

async function listaPersonagens(personagem) {
  const episodioNResponde = await axios.get(personagem.episode[0]);
  const episodioNome = episodioNResponde.data.name;
  let card = document.getElementById("cardContainer");
  let statusCor = "";
  let statusTexto = "";
  if (personagem.status === "Alive") {
    statusCor = "#56CD42";
    statusTexto = "Vivo";
  } else if (personagem.status === "Dead") {
    statusCor = "#CD4242";
    statusTexto = "Morto";
  } else {
    statusCor = "#BBBBBB";
    statusTexto = "Desconhecido";
  }

  card.innerHTML += `<div class="personagem">
    <img src="${personagem.image}" alt="">
    <div class="nomePersonagem">
    <div class="statusPersonagem">
      <article>
        <span>${personagem.name}</span>
      </article>
      <div>
        <div class="statusCirculo" style="background-color: ${statusCor};"></div>
        <span>${statusTexto} - ${personagem.species}</span>
      </div>
    </div>
      <div>
        <p>Última localização conhecida:</p>
        <span>${personagem.location.name}</span>
      </div>
      <div>
        <p>Visto a última vez em:</p>
        <span>${episodioNome}</span>
      </div>  
    </div>
  </div>`;
}

function criarPersonagens(criarPersonagem) {
  let card = document.getElementById("cardContainer");
  card.innerHTML = "";
  criarPersonagem.forEach((personagem) => {
    listaPersonagens(personagem);
  });
}

function mostrarPersonagem(res) {
  const personagens = res.results;
  informacoes = res.info;
  criarPersonagens(personagens);
}

const inputBusca = document.getElementById("buscarPersonagem");
inputBusca.addEventListener("input", () => buscarPersonagens());

function buscarPersonagens() {
  const buscaP = inputBusca.value;
  loadPagina("/character/?page=1", buscaP);
}

function paginacaoPrincipal(url) {
  if (url != null) {
    loadPagina(url);
  }
}

const btnAnterior = document.getElementById("anterior-btn");
const btnProximo = document.getElementById("proxima-btn");

btnAnterior.addEventListener("click", () => {
  paginacaoPrincipal(anteriorPagina, inputBusca.value);
  window.scrollTo(0, 0);
});
btnProximo.addEventListener("click", () => {
  paginacaoPrincipal(proximaPagina, inputBusca.value);
  window.scrollTo(0, 0);
});

function contagemApi() {
  const personagemTotal = document.getElementById("characterTotal");
  const localizacaoTotal = document.getElementById("locationTotal");
  const episodiosTotal = document.getElementById("episodeTotal");
  urlPrincipal.get("/character").then((res) => {
    const personagensQuantidade = res.data.info.count;

    personagemTotal.textContent = "Personagens: " + personagensQuantidade;
  });

  urlPrincipal.get("/location").then((res) => {
    const localizacaoQuantidade = res.data.info.count;

    localizacaoTotal.textContent = "Localizações: " + localizacaoQuantidade;
  });

  urlPrincipal.get("/episode").then((res) => {
    const episodiosQuantidade = res.data.info.count;

    episodiosTotal.textContent = "Episódios: " + episodiosQuantidade;
  });
}
