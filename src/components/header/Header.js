import logoUrl from "../../assets/images/pintrest-logo.png";
import searchIconUrl from "../../assets/images/search-icon.png";
import bellIconUrl from "../../assets/images/bell-svg.svg";
import blurbIconUrl from "../../assets/images/blurb-svg.svg";

export function createHeader({ onSearch, onReset }) {
  const header = document.createElement("header");
  header.classList.add("header");
  header.id = "header";

  header.innerHTML = `
    <div class="header-left">
      <a href="#" class="logo" data-app-logo aria-label="Gallery Home">
        <img src="${logoUrl}" alt="Logo">
      </a>

      <nav class="main-nav" aria-label="Navegacion principal">
        <ul>
          <li><a href="#header" class="btn btn-pill btn-dark">Inicio</a></li>
          <li><a href="#header" class="btn btn-pill">Explorar</a></li>
          <li><a href="#header" class="btn btn-pill">Crear</a></li>
        </ul>
      </nav>
    </div>

    <div class="search-container">
      <label for="search-box" class="sr-only">Buscar en galeria</label>
      <div class="search-input-wrapper">
        <img src="${searchIconUrl}" alt="" aria-hidden="true" class="search-icon">
        <input type="search" id="search-box" class="search-input" placeholder="Buscar">
      </div>
    </div>

    <div class="header-right">
      <!-- Bell Icon Button -->
      <button type="button" class="icon-button" aria-label="Ver notificaciones">
        <img src="${bellIconUrl}" alt="" aria-hidden="true">
      </button>

      <!-- Blurb Icon Button -->
      <button type="button" class="icon-button" aria-label="Abrir mensajes">
        <img src="${blurbIconUrl}" alt="" aria-hidden="true">
      </button>
    </div>

    <a href="#header" class="profile-circle" aria-label="Ver perfil de usuario">
      <span class="profile-text">CT</span>
    </a>
  `;

  const searchInput = header.querySelector("#search-box");
  const appLogo = header.querySelector("[data-app-logo]");

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault(); // Prevent form-like Enter behavior from reloading the page.
    await onSearch(searchInput.value.trim());
    searchInput.value = ""; // Clear the search box after performing the search.
  });

  appLogo.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the empty link from changing the page position.
    searchInput.value = ""; // Clear the input when returning to the initial state.
    await onReset();
  });

  return header;
}
