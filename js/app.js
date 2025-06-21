// js/app.js

const catalogo = document.getElementById('catalogo');
const searchInput = document.getElementById('searchInput');
const filtroGenero = document.getElementById('filtroGenero');
const btnFavoritos = document.getElementById('btnFavoritos');

let filmes = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let mostrandoFavoritos = false;

fetch('data/filmes.json')
  .then(response => response.json())
  .then(data => {
    filmes = data;
    renderizarFilmes(filmes);
  });

function renderizarFilmes(lista) {
  catalogo.innerHTML = '';
  lista.forEach(filme => {
    const card = document.createElement('div');
    card.classList.add('filme');
    card.innerHTML = `
      <img src="${filme.capa}" alt="Capa de ${filme.titulo}">
      <h2>${filme.titulo}</h2>
      <p>${filme.genero} - ${filme.ano}</p>
      <button onclick="toggleFavorito(${filme.id})">
        ${favoritos.includes(filme.id) ? '💖' : '🤍'}
      </button>
    `;
    catalogo.appendChild(card);
  });
}

function toggleFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  const filtrados = aplicarFiltros();
  renderizarFilmes(filtrados);
}

function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase();
  const genero = filtroGenero.value;
  return filmes.filter(filme => {
    const cond1 = filme.titulo.toLowerCase().includes(texto);
    const cond2 = genero === 'todos' || filme.genero === genero;
    return cond1 && cond2;
  });
}

searchInput.addEventListener('input', () => {
  const filtrados = aplicarFiltros();
  renderizarFilmes(filtrados);
  mostrandoFavoritos = false;
  btnFavoritos.textContent = 'Ver Favoritos ❤️';
});

filtroGenero.addEventListener('change', () => {
  const filtrados = aplicarFiltros();
  renderizarFilmes(filtrados);
  mostrandoFavoritos = false;
  btnFavoritos.textContent = 'Ver Favoritos ❤️';
});

btnFavoritos.addEventListener('click', () => {
  if (mostrandoFavoritos) {
    renderizarFilmes(filmes);
    btnFavoritos.textContent = 'Ver Favoritos ❤️';
  } else {
    const favoritosFilmes = filmes.filter(f => favoritos.includes(f.id));
    renderizarFilmes(favoritosFilmes);
    btnFavoritos.textContent = 'Voltar 🔙';
  }
  mostrandoFavoritos = !mostrandoFavoritos;
});
