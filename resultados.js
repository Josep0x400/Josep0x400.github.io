// Configuración de Supabase
const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const LIBROS_POR_PAGINA = 6;
let paginaActual = 1;
let totalPaginas = 1;
let totalLibros = 0;

// Ejecuta la carga inicial
window.onload = function() {
    cargarResultados();
};

async function cargarResultados() {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('busqueda');
    const autorId = params.get('autor');
    const categoriaId = params.get('categoria');
    const anioInicio = params.get('anioInicio');
    const anioFin = params.get('anioFin');

    let query = supabaseClient
        .from('Libros')
        .select(`
            libro_id,
            titulo,
            anio_publicacion,
            Autores (nombre_autor),
            Categorias (nombre_categoria)
        `, { count: 'exact' }) // <-- IMPORTANTE: pedir el total
        .order('anio_publicacion', { ascending: false });

    if (busqueda) query = query.ilike('titulo', `%${busqueda}%`);
    if (autorId) query = query.eq('autor_id', autorId);
    if (categoriaId) query = query.eq('categoria_id', categoriaId);
    if (anioInicio) query = query.gte('anio_publicacion', anioInicio);
    if (anioFin) query = query.lte('anio_publicacion', anioFin);

    // Paginación: calcula rango de libros a mostrar
    const desde = (paginaActual - 1) * LIBROS_POR_PAGINA;
    const hasta = desde + LIBROS_POR_PAGINA - 1;

    const { data, count, error } = await query.range(desde, hasta);

    if (error) {
        document.getElementById('resultados').innerHTML = '<p>Error al cargar resultados.</p>';
        return;
    }

    totalLibros = count || 0;
    totalPaginas = Math.ceil(totalLibros / LIBROS_POR_PAGINA);

    mostrarResultados(data);
    mostrarPaginacion();
}

function mostrarResultados(libros) {
    const div = document.getElementById('resultados');
    if (!libros || libros.length === 0) {
        div.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    let html = '<div class="cards-contenedor">';
    libros.forEach(libro => {
        html += `
        <div class="card-libro">
            <h2>${libro.titulo}</h2>
            <p><strong>Autor:</strong> ${libro.Autores ? libro.Autores.nombre_autor : 'Sin autor'}</p>
            <p><strong>Categoría:</strong> ${libro.Categorias ? libro.Categorias.nombre_categoria : 'Sin categoría'}</p>
            <p><strong>Año:</strong> ${libro.anio_publicacion || ''}</p>
        </div>
        `;
    });
    html += '</div>';
    div.innerHTML = html;
}

function mostrarPaginacion() {
    const pagDiv = document.getElementById('paginacion');
    if (totalPaginas <= 1) {
        pagDiv.innerHTML = '';
        return;
    }

    let html = `<div class="controles-paginacion">`;

    html += `<button ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual - 1})">Anterior</button>`;

    // Números de página (máximo 7 botones)
    let inicio = Math.max(1, paginaActual - 3);
    let fin = Math.min(totalPaginas, paginaActual + 3);
    for (let i = inicio; i <= fin; i++) {
        html += `<button ${i === paginaActual ? 'disabled style="font-weight:bold;"' : ''} onclick="cambiarPagina(${i})">${i}</button>`;
    }

    html += `<button ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual + 1})">Siguiente</button>`;
    html += `<div style="margin-top:8px; font-size:0.95em;">Página ${paginaActual} de ${totalPaginas} &mdash; Mostrando ${(paginaActual-1)*LIBROS_POR_PAGINA+1} a ${Math.min(paginaActual*LIBROS_POR_PAGINA, totalLibros)} de ${totalLibros} libros</div>`;
    html += `</div>`;

    pagDiv.innerHTML = html;
}

// Cambia de página y recarga resultados
window.cambiarPagina = function(nuevaPagina) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas || nuevaPagina === paginaActual) return;
    paginaActual = nuevaPagina;
    cargarResultados();
};
