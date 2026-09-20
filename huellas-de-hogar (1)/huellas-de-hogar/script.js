/* =========================================================
   HUELLAS DE HOGAR — script.js
   Conecta con Supabase para leer mascotas y guardar
   solicitudes de adopción. Si no hay Supabase configurado,
   usa datos de ejemplo para que el sitio funcione igual.
   ========================================================= */

/* ---------- 1. CONFIGURA AQUÍ TU PROYECTO DE SUPABASE ---------- */
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU-CLAVE-ANON-PUBLICA";

let supabase = null;
try {
  if (window.supabase && !SUPABASE_URL.includes("TU-PROYECTO")) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase no se pudo inicializar, usando datos de ejemplo.", err);
}

/* ---------- 2. DATOS DE EJEMPLO (se usan si Supabase no está configurado) ---------- */
const MASCOTAS_DEMO = [
  { id: 1, nombre: "Rocky", especie: "perro", raza: "Mestizo", edad: 2, tamano: "mediano", sexo: "macho",
    descripcion: "Rocky es juguetón, aprendió a sentarse y a dar la pata en dos semanas. Le encanta correr en el parque.",
    imagen_url: "https://place.dog/500/400?id=10", estado: "disponible" },
  { id: 2, nombre: "Mia", especie: "gato", raza: "Común europeo", edad: 1, tamano: "pequeño", sexo: "hembra",
    descripcion: "Mia es curiosa y muy limpia. Se lleva bien con otros gatos y le fascina dormir cerca de una ventana.",
    imagen_url: "https://cataas.com/cat/595f280f557291a9750ebfb7?width=500&height=400", estado: "disponible" },
  { id: 3, nombre: "Toby", especie: "perro", raza: "Labrador mix", edad: 4, tamano: "grande", sexo: "macho",
    descripcion: "Toby es tranquilo y protector, ideal para una familia con niños. Ya sabe caminar con correa sin jalar.",
    imagen_url: "https://place.dog/500/400?id=20", estado: "disponible" },
  { id: 4, nombre: "Luna", especie: "gato", raza: "Siamés mix", edad: 3, tamano: "pequeño", sexo: "hembra",
    descripcion: "Luna es independiente pero cariñosa por las noches. Está esterilizada y al día con sus vacunas.",
    imagen_url: "https://cataas.com/cat/595f2810557291a9750ebfce?width=500&height=400", estado: "disponible" },
  { id: 5, nombre: "Simba", especie: "perro", raza: "Criollo", edad: 1, tamano: "pequeño", sexo: "macho",
    descripcion: "Simba llegó como cachorro rescatado de la calle. Es sociable con otros perros y muy energético.",
    imagen_url: "https://place.dog/500/400?id=30", estado: "adoptado" },
  { id: 6, nombre: "Nala", especie: "gato", raza: "Naranjo común", edad: 2, tamano: "mediano", sexo: "hembra",
    descripcion: "Nala es la reina de la casa cuna: tranquila, ronroneadora y perfecta para departamentos.",
    imagen_url: "https://cataas.com/cat/60c0d08ec441cc0011a913c5?width=500&height=400", estado: "disponible" },
  { id: 7, nombre: "Max", especie: "perro", raza: "Pastor mix", edad: 5, tamano: "grande", sexo: "macho",
    descripcion: "Max es un perro adulto, ya entrenado, obediente y muy leal. Busca un hogar tranquilo.",
    imagen_url: "https://place.dog/500/400?id=40", estado: "disponible" },
  { id: 8, nombre: "Coco", especie: "gato", raza: "Tricolor", edad: 1, tamano: "pequeño", sexo: "hembra",
    descripcion: "Coco es juguetona y muy activa, perfecta para una casa con espacio para explorar.",
    imagen_url: "https://cataas.com/cat/61009bfbcaacc400184f6b2b?width=500&height=400", estado: "disponible" },
];

/* ---------- 3. ESTADO ---------- */
let mascotas = [];
let filtroEspecie = "todas";
let filtroTamano = "todos";

const grid = document.getElementById("pets-grid");
const status = document.getElementById("pets-status");

/* ---------- 4. CARGA DE DATOS ---------- */
async function cargarMascotas() {
  if (supabase) {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error leyendo Supabase:", error);
      status.textContent = "No se pudo conectar a la base de datos, mostrando datos de ejemplo.";
      mascotas = MASCOTAS_DEMO;
    } else {
      mascotas = data && data.length ? data : MASCOTAS_DEMO;
      status.hidden = true;
    }
  } else {
    mascotas = MASCOTAS_DEMO;
    status.textContent = "Modo de ejemplo: conecta tu proyecto de Supabase en script.js para datos reales.";
  }
  actualizarEstadisticas();
  renderMascotas();
}

function actualizarEstadisticas() {
  const disponibles = mascotas.filter(m => m.estado !== "adoptado");
  document.getElementById("stat-total").textContent = disponibles.length;
  document.getElementById("stat-perros").textContent = disponibles.filter(m => m.especie === "perro").length;
  document.getElementById("stat-gatos").textContent = disponibles.filter(m => m.especie === "gato").length;
}

/* ---------- 5. RENDER ---------- */
function renderMascotas() {
  const filtradas = mascotas.filter(m => {
    const okEspecie = filtroEspecie === "todas" || m.especie === filtroEspecie;
    const okTamano = filtroTamano === "todos" || m.tamano === filtroTamano;
    return okEspecie && okTamano;
  });

  grid.innerHTML = "";

  if (filtradas.length === 0) {
    grid.innerHTML = `<p class="pets-empty">No hay mascotas con estos filtros por ahora. Vuelve a intentarlo más tarde.</p>`;
    return;
  }

  filtradas.forEach((m, i) => {
    const card = document.createElement("button");
    card.className = "pet-card";
    card.style.setProperty("--tilt", `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg`);
    card.setAttribute("aria-haspopup", "dialog");

    const esAdoptado = m.estado === "adoptado";
    card.innerHTML = `
      <img class="pet-photo" src="${m.imagen_url}" alt="Foto de ${m.nombre}" loading="lazy">
      <h3>${m.nombre}</h3>
      <div class="pet-meta">
        <span>${m.raza || (m.especie === "perro" ? "Perro" : "Gato")}</span>
        <span>${m.edad} ${m.edad === 1 ? "año" : "años"}</span>
        <span>${capitalizar(m.tamano)}</span>
      </div>
      <span class="badge-status ${esAdoptado ? "adoptado" : ""}">${esAdoptado ? "Ya adoptado" : "Disponible"}</span>
    `;
    card.addEventListener("click", () => abrirModal(m));
    grid.appendChild(card);
  });
}

function capitalizar(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ---------- 6. FILTROS ---------- */
document.querySelectorAll('.chip[data-filter="especie"]').forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll('.chip[data-filter="especie"]').forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    filtroEspecie = btn.dataset.value;
    renderMascotas();
  });
});

document.getElementById("filtro-tamano").addEventListener("change", (e) => {
  filtroTamano = e.target.value;
  renderMascotas();
});

/* ---------- 7. MODAL: ficha + formulario de adopción ---------- */
const overlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");

function abrirModal(mascota) {
  const esAdoptado = mascota.estado === "adoptado";

  modalBody.innerHTML = `
    <img class="modal-photo" src="${mascota.imagen_url}" alt="Foto de ${mascota.nombre}">
    <h2 id="modal-title">${mascota.nombre}</h2>
    <div class="pet-meta">
      <span>${mascota.raza || ""}</span>
      <span>${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}</span>
      <span>${capitalizar(mascota.tamano)}</span>
      <span>${mascota.sexo === "hembra" ? "Hembra" : "Macho"}</span>
    </div>
    <p class="modal-desc">${mascota.descripcion || "Pronto agregaremos más información sobre esta mascota."}</p>

    ${esAdoptado
      ? `<p class="form-msg">Esta mascota ya encontró un hogar 💛. Mira otras en el listado.</p>`
      : `
      <form id="form-adopcion" novalidate>
        <div class="form-row">
          <label for="f-nombre">Tu nombre completo</label>
          <input type="text" id="f-nombre" required>
        </div>
        <div class="form-row">
          <label for="f-email">Correo electrónico</label>
          <input type="email" id="f-email" required>
        </div>
        <div class="form-row">
          <label for="f-telefono">Teléfono</label>
          <input type="tel" id="f-telefono" required>
        </div>
        <div class="form-row">
          <label for="f-mensaje">Cuéntanos por qué quieres adoptar a ${mascota.nombre}</label>
          <textarea id="f-mensaje" rows="3"></textarea>
        </div>
        <p id="form-error" class="form-error" hidden></p>
        <button type="submit" class="btn btn-primary">Enviar solicitud de adopción</button>
        <p id="form-msg" class="form-msg" hidden></p>
      </form>
    `}
  `;

  overlay.hidden = false;
  document.body.style.overflow = "hidden";

  const form = document.getElementById("form-adopcion");
  if (form) {
    form.addEventListener("submit", (e) => enviarSolicitud(e, mascota));
  }
}

function cerrarModal() {
  overlay.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", cerrarModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrarModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) cerrarModal(); });

/* ---------- 8. ENVÍO DE SOLICITUD A SUPABASE ---------- */
async function enviarSolicitud(e, mascota) {
  e.preventDefault();
  const nombre = document.getElementById("f-nombre").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const telefono = document.getElementById("f-telefono").value.trim();
  const mensaje = document.getElementById("f-mensaje").value.trim();
  const errorEl = document.getElementById("form-error");
  const msgEl = document.getElementById("form-msg");
  const submitBtn = e.target.querySelector("button[type=submit]");

  if (!nombre || !email || !telefono) {
    errorEl.textContent = "Por favor completa nombre, correo y teléfono.";
    errorEl.hidden = false;
    return;
  }
  errorEl.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";

  const solicitud = {
    pet_id: mascota.id,
    nombre_solicitante: nombre,
    email,
    telefono,
    mensaje,
  };

  try {
    if (supabase) {
      const { error } = await supabase.from("adoption_requests").insert([solicitud]);
      if (error) throw error;
    } else {
      console.log("Modo demo, solicitud no guardada en la nube:", solicitud);
      await new Promise(r => setTimeout(r, 600));
    }
    msgEl.textContent = `¡Gracias, ${nombre}! Recibimos tu solicitud para adoptar a ${mascota.nombre}. Te contactaremos pronto.`;
    msgEl.hidden = false;
    e.target.querySelector('button[type="submit"]').style.display = "none";
    mostrarToast("Solicitud enviada correctamente 🐾");
  } catch (err) {
    console.error(err);
    errorEl.textContent = "Ocurrió un problema al enviar tu solicitud. Intenta de nuevo.";
    errorEl.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar solicitud de adopción";
  }
}

/* ---------- 9. TOAST ---------- */
let toastTimer = null;
function mostrarToast(texto) {
  const toast = document.getElementById("toast");
  toast.textContent = texto;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

/* ---------- 10. INICIO ---------- */
// La ubicación del refugio ahora se muestra como una imagen satelital
// fija (ver index.html, sección #ubicacion), no como mapa interactivo.
document.addEventListener("DOMContentLoaded", () => {
  cargarMascotas();
});
