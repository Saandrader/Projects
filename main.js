const selectedPokemon = document.querySelector(".selected-pokemon");
const pokemonList = document.querySelector("#pokemon-list");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const searchBar = document.getElementById("searchbar");
searchBar.addEventListener("input", filtrarLista);
window.addEventListener("load", function () {
  document.getElementById("loader").style.display = "none";
});

//Mostrar cartas pokemon dentro de la lista
function showPokemon(poke) {
  let types = poke.types.map(
    (type) =>
      `<p class="${type.type.name} type" >${type.type.name.toUpperCase()}</p>`
  );
  types = types.join("");

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.id = poke.id;
  div.addEventListener("click", (event) => handleClick(event.currentTarget.id));

  div.innerHTML = `<div class="pokemon-img">
    <img
      src="${poke.sprites.other["official-artwork"].front_default}"
      alt="${poke.name}"
      loading="lazy"
    />
  </div>
  <div class="pokemon-info">
  <p class="pokemon-id">n°${poke.id}</p>
  <h4 class="pokemon-name">${
    poke.name.charAt(0).toUpperCase() + poke.name.slice(1)
  }</h4>
  <div class="pokemon-type">
  ${types}
  </div>
    
  </div>
  `;
  pokemonList.append(div);
}

//Parsear la data del pokemon seleccionado a partes html
function parseData(poke) {
  let types = poke.types.map(
    (type) =>
      `<p class="${type.type.name} type" id="${
        poke.id
      }">${type.type.name.toUpperCase()}</p>`
  );
  types = types.join("");

  let colorType = poke.types.map((type) => type.type.name);

  let abilities = poke.abilities.map(
    (ability) =>
      ` <div class="ability ${
        colorType[0]
      }"><p>${ability.ability.name.toUpperCase()}</p></div>`
  );
  abilities = abilities.join("");

  let stats = poke.stats.map(
    (stat) =>
      `<div class="stat ${stat.stat.name}">
      <div>
        <p>${stat.stat.name.slice(0, 2)}</p>
      </div>
      <p>${stat.base_stat}</p>
    </div>`
  );
  stats = stats.join("");

  const totalStats = poke.stats.reduce(
    (acumulador, stat) => acumulador + stat.base_stat,
    0
  );

  const totalStat = `<div class="stat total">
  <div>
    <p>To</p>
  </div>
  <p>${totalStats}</p>
</div>`;

  const baseExp = poke.base_experience;
  const height = poke.height;
  const weight = poke.weight;

  return { types, abilities, height, weight, baseExp, stats, totalStat };
}

//Mostrar el pokemon seleccionado al hacer click en una card
async function handleClick(id) {
  id = parseInt(id);
  let response = await fetch(URL + id);
  const poke = response != "" ? await response.json() : null;
  const { types, abilities, height, weight, baseExp, stats, totalStat } =
    parseData(poke);

  //Condicional para no poner boton de anterior o siguiente en el primer y ultimo pokemon
  response = id != 1 ? await fetch(URL + (id - 1)) : null;
  const backInfo = response != null ? await response.json() : null;
  response = id != 156 ? await fetch(URL + (id + 1)) : null;
  const nextInfo = response != null ? await response.json() : null;

  //Manipulacion del DOM
  selectedPokemon.innerHTML = `<div class="selected-img">
<img
  src="${poke.sprites.other["official-artwork"].front_default}"
  alt="${poke.name}"
/>
</div>
<p class="pokemon-id">n°${poke.id}</p>
<h2>${poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h2>

<div class="pokemon-type">
${types}
</div>
<div class="entry">
<h4>Pokedex Entry</h4>
No encontre una descripcion del pokemon en la api :c
</div>
<h4>Abilities</h4>
<div class="abilities">
${abilities}
</div>

<div class="pokemon-attributes">
<div class="attribute">
  <h5>Height</h5>

    <p>${height}</p>

</div>
<div class="attribute">
  <h5>Weight</h5>

    <p>${weight}</p>

</div>
<div class="attribute">
  <h5>Base exp</h5>

    <p>${baseExp}</p>
 
</div>
</div>
<h4>Stats</h4>
<div class="stats">
${stats}
${totalStat}
</div>
<div class="selected-buttons">
${
  backInfo == null
    ? ``
    : `<div class="backbutton">
    <img
    src="${backInfo.sprites.other["official-artwork"].front_default}"
    alt="${backInfo.name}"
  /> 
      <p class="button-name">${backInfo.name}</p>
      <p>#${backInfo.id}</p>
    </div>`
}
|
${
  nextInfo == null
    ? ``
    : `
    <div class="nextbutton">
          <p>#${nextInfo.id}</p>
          <p class="button-name">${nextInfo.name}</p>
          <img
          src="${nextInfo.sprites.other["official-artwork"].front_default}"
          alt="${nextInfo.name}"
        />
          </div>
    `
}
        </div>
`;

  //Añadir event listener a los nuevos botones
  if (backInfo) {
    const backbutton = document.querySelector(".backbutton");
    backbutton.addEventListener("click", () => handleClick(id - 1));
  }
  if (nextInfo) {
    const nextbutton = document.querySelector(".nextbutton");
    nextbutton.addEventListener("click", () => handleClick(id + 1));
  }
}

//Recibir la data de los pokemones de la api
for (let i = 1; i <= 151; i++) {
  fetch(URL + i)
    .then((response) => response.json())
    .then((data) => showPokemon(data));
}

//Filtrar pokemones con la barra de busqueda
function filtrarLista() {
  const list = pokemonList.getElementsByClassName("pokemon");

  const textoBusqueda =
    searchBar.value.charAt(0).toUpperCase() +
    searchBar.value.slice(1).toLowerCase();

  for (let i = 0; i < list.length; i++) {
    const pokemonName = list[i]
      .getElementsByClassName("pokemon-info")[0]
      .querySelector("h4").textContent;
    if (pokemonName.includes(textoBusqueda)) {
      list[i].style.display = "block";
    } else {
      list[i].style.display = "none";
    }
  }
}
