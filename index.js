window.onload = () => [loadPagina()];

const urlPrincipal = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

function loadPagina(url) {
  urlPrincipal.get(url).then((res) => {
    const paginas = res.data;
    console.log(paginas);
  });
}
