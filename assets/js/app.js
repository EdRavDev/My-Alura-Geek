// CONFIGURACION SUPABASE
const SUPABASE_URL = 'https://mguyusmbrwuhtvvpgwmv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndXl1c21icnd1aHR2dnBnd212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjMyMzAsImV4cCI6MjA4NTk5OTIzMH0.emlGd9B_ci_fpQdyFBm4wP0CfRCBCx6-l6cNVDTLkDo';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos del DOM
const juegosPendientesContainer = document.querySelector('.cards_grid');
const juegosTerminadosContainer = document.querySelector('.juegos_terminados__container');
const formulario = document.querySelector('.agregar_juegos__container form');

// Cargar Juegos al Iniciar
document.addEventListener('DOMContentLoaded', listarJuegos);

async function listarJuegos() {
    try {
        const { data: juegos, error } = await supabaseClient
            .from('games')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        juegosPendientesContainer.innerHTML = '';
        juegosTerminadosContainer.innerHTML = '';

        juegos.forEach(juego => {
            const card = crearCard(juego);
            if (juego.completed) {
                juegosTerminadosContainer.appendChild(card);
            } else {
                juegosPendientesContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error cargando juegos:", error);
    }
}

function crearCard(juego) {
    const card = document.createElement('div');
    card.classList.add('card');

    let actionHTML = '';
    if (juego.completed) {
        actionHTML = `
            <span class="terminado-label">Terminado</span>
            <button class="btn-eliminar" data-id="${juego.id}" title="Eliminar Juego">🗑️</button>
        `;
    } else {
        actionHTML = `
            <div class="card_info">
                 <input type="checkbox" class="finish-check" data-id="${juego.id}" title="Marcar como terminado">
            </div>
        `;
    }

    card.innerHTML = `
        <img src="${juego.image_url || 'assets/img/ui/header alurageek.png'}" alt="${juego.name}">
        <div class="card_info">
            <p>${juego.name}</p>
            <p>${juego.platform}</p>
        </div>
        ${actionHTML}
    `;

    const btnEliminar = card.querySelector('.btn-eliminar');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => eliminarJuego(juego.id));
    }

    const checkFinish = card.querySelector('.finish-check');
    if (checkFinish) {
        checkFinish.addEventListener('change', () => finalizarJuego(juego.id));
    }

    return card;
}

// Agregar Juego
const plataformaSelect = document.getElementById('plataformaSelect');
const plataformaInput = document.getElementById('plataformaInput');

plataformaSelect.addEventListener('change', () => {
    if (plataformaSelect.value === 'Other') {
        plataformaInput.style.display = 'block';
        plataformaInput.setAttribute('required', 'true');
    } else {
        plataformaInput.style.display = 'none';
        plataformaInput.removeAttribute('required');
        plataformaInput.value = '';
    }
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = formulario.querySelector('input[type="text"]').value;
    const imagenInput = formulario.querySelector('input[type="file"]');

    let plataforma = plataformaSelect.value;
    if (plataforma === 'Other') {
        plataforma = plataformaInput.value;
    }

    if (!nombre || !plataforma) {
        alert("Completa los campos obligatorios");
        return;
    }

    let publicUrl = null;

    if (imagenInput.files.length > 0) {
        const file = imagenInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { data, error } = await supabaseClient.storage
                .from('game-imagenes')
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicData } = supabaseClient.storage
                .from('game-imagenes')
                .getPublicUrl(filePath);

            publicUrl = publicData.publicUrl;

        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen");
            return;
        }
    }

    try {
        const { error } = await supabaseClient
            .from('games')
            .insert({
                name: nombre,
                platform: plataforma,
                image_url: publicUrl,
                completed: false
            });

        if (error) throw error;

        formulario.reset();
        plataformaInput.style.display = 'none';
        listarJuegos();

    } catch (error) {
        console.error("Error guardando juego:", error);
    }
});

// Finalizar Juego
async function finalizarJuego(id) {
    try {
        const { error } = await supabaseClient
            .from('games')
            .update({ completed: true })
            .eq('id', id);

        if (error) throw error;
        listarJuegos();
    } catch (error) {
        console.error("Error finalizando juego:", error);
    }
}

// Eliminar Juego
async function eliminarJuego(id) {
    if (!confirm("Estas seguro de eliminar este juego?")) return;

    try {
        const { error } = await supabaseClient
            .from('games')
            .delete()
            .eq('id', id);

        if (error) throw error;
        listarJuegos();
    } catch (error) {
        console.error("Error eliminando juego:", error);
    }
}

// Logica del Modo Oscuro/Claro
const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;
const homeButton = document.getElementById('btn-home');

const iconMoon = "assets/img/ui/moon.png";
const iconSun = "assets/img/ui/sun.png";

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeIcon.src = iconSun;
} else {
    themeIcon.src = iconMoon;
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeIcon.src = iconSun;
    } else {
        localStorage.setItem('theme', 'dark');
        themeIcon.src = iconMoon;
    }
});

homeButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});