// Elementos del DOM
const contenedor = document.getElementById("personajes-section");
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtro-estado");
const filtroEspecie = document.getElementById("filtro-especie");


let personajes = [];

// Cargar todos los personajes
async function obtenerTodosLosPersonajes() {
  let pagina = 1;
  let siguiente = true;
  personajes = [];

  try {
    while (siguiente) {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
      const datos = await res.json();
      personajes = personajes.concat(datos.results);

      if (datos.info.next) {
        pagina++;
      } else {
        siguiente = false;
      }
    }

    llenarFiltroEspecie(); 
    aplicarFiltros(); 

  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar personajes.</p>";
  }
}

// Mostrar personajes en pantalla
function mostrarPersonajes(lista) {
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron personajes.</p>";
    return;
  }

  lista.forEach(personaje => {
    const card = document.createElement("article");
    card.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}" />
      <h2>${personaje.name}</h2>
      <p><strong>Estado:</strong> ${personaje.status}</p>
      <p><strong>Especie:</strong> ${personaje.species}</p>
    `;
    contenedor.appendChild(card);
  });
}

// Llenar las opciones del filtro 
function llenarFiltroEspecie() {
  const especiesUnicas = [...new Set(personajes.map(p => p.species))];
  especiesUnicas.sort();

  especiesUnicas.forEach(especie => {
    const option = document.createElement("option");
    option.value = especie.toLowerCase();
    option.textContent = especie;
    filtroEspecie.appendChild(option);
  });
}

// Aplicar filtros de búsqueda
function aplicarFiltros() {
  const texto = buscador.value.toLowerCase();
  const estado = filtroEstado.value;
  const especie = filtroEspecie.value;

  const filtrados = personajes.filter(personaje => {
    const nombreCoincide = personaje.name.toLowerCase().includes(texto);
    const estadoCoincide = estado === "all" || personaje.status.toLowerCase() === estado;
    const especieCoincide = especie === "all" || personaje.species.toLowerCase() === especie;

    return nombreCoincide && estadoCoincide && especieCoincide;
  });

  mostrarPersonajes(filtrados);
}

buscador.addEventListener("input", aplicarFiltros);
filtroEstado.addEventListener("change", aplicarFiltros);
filtroEspecie.addEventListener("change", aplicarFiltros);

obtenerTodosLosPersonajes();