const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const { createClient } = supabase;
const client = supabase.createClient(supabaseUrl, supabaseKey);

// Configuración de paginación
let paginaActual = 1;
const porPagina = 9;

// Función para redirigir a resultados
function navegarResultados(parametros = {}) {
    const queryString = new URLSearchParams(parametros).toString();
    window.location.href = `resultados.html?${queryString}`;
}

// Función de búsqueda rápida
function buscarRapida() {
    const termino = document.getElementById('busqueda-rapida').value;
    navegarResultados({ busqueda: termino });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const parametros = {
        autor: document.getElementById('filtro-autor').value,
        categoria: document.getElementById('filtro-categoria').value,
        anioInicio: document.getElementById('anio-inicio').value,
        anioFin: document.getElementById('anio-fin').value
    };
    navegarResultados(parametros);
}

// Cargar y mostrar resultados
async function cargarResultados() {
    try {
        const params = new URLSearchParams(window.location.search);
        
        let query = client.from('Libros')
            .select('*, Autores:autor_id(nombre_autor), Categorias:categoria_id(nombre_categoria)', { 
                count: 'exact' 
            });

        // Aplicar filtros desde URL
        if(params.get('busqueda')) query = query.ilike('titulo', `%${params.get('busqueda')}%`);
        if(params.get('autor')) query = query.eq('autor_id', params.get('autor'));
        if(params.get('categoria')) query = query.eq('categoria_id', params.get('categoria'));
        if(params.get('anioInicio') && params.get('anioFin')) {
            query = query
                .gte('anio_publicacion', `${params.get('anioInicio')}-01-01`)
                .lte('anio_publicacion', `${params.get('anioFin')}-12-31`);
        }

        // Paginación
        const { data, error, count } = await query
            .range((paginaActual - 1) * porPagina, paginaActual * porPagina - 1);

        if(error) throw error;

        mostrarResultados(data);
        actualizarPaginacion(count);
    } catch(error) {
        console.error('Error:', error);
        document.getElementById('resultados').innerHTML = `
            <div class="mensaje-error">
                Error al cargar los resultados. Intenta nuevamente.
            </div>
        `;
    }
}

function mostrarResultados(libros) {
    const contenedor = document.getElementById('resultados');
    contenedor.innerHTML = libros.map(libro => `
        <div class="libro-card">
            <h3>${libro.titulo}</h3>
            <p class="autor">${libro.Autores?.nombre_autor || 'Autor desconocido'}</p>
            <p class="categoria">${libro.Categorias?.nombre_categoria || 'Sin categoría'}</p>
            <p class="anio">${new Date(libro.anio_publicacion).getFullYear()}</p>
            <p class="isbn">ISBN: ${libro.isbn}</p>
        </div>
    `).join('');
}


/** Actualiza el texto “Página X de Y” */
function actualizarPaginacion(totalItems) {
    const info = document.getElementById('info-paginacion');
    const totalPaginas = Math.ceil(totalItems / porPagina) || 1;
    info.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }
  
  /** Manejadores para “Anterior” y “Siguiente” */
  function configurarPaginacion() {
    document.getElementById('btn-prev').onclick = () => {
      if (paginaActual > 1) {
        paginaActual--;
        cargarResultados();
      }
    };
    document.getElementById('btn-next').onclick = () => {
      paginaActual++;
      cargarResultados();
    };
  }

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar opciones de filtros
    if(window.location.pathname.includes('filtros.html')) {
        const { data: autores } = await client.from('Autores').select('*');
        const { data: categorias } = await client.from('Categorias').select('*');

        const selectAutor = document.getElementById('filtro-autor');
        selectAutor.innerHTML += autores.map(a => 
            `<option value="${a.autor_id}">${a.nombre_autor}</option>`
        ).join('');

        const selectCategoria = document.getElementById('filtro-categoria');
        selectCategoria.innerHTML += categorias.map(c => 
            `<option value="${c.categoria_id}">${c.nombre_categoria}</option>`
        ).join('');
    }
    
    // Cargar resultados si estamos en esa página
    if(window.location.pathname.includes('resultados.html')) {
        cargarResultados();
        configurarPaginacion();
    }
});