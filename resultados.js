// Configuración de Supabase
const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

window.onload = async function() {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('busqueda'); // <-- NUEVO: lee el parámetro de búsqueda
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
        `)
        .order('anio_publicacion', { ascending: false });

    // Aplica el filtro de búsqueda si existe
    if (busqueda) query = query.ilike('titulo', `%${busqueda}%`);
    if (autorId) query = query.eq('autor_id', autorId);
    if (categoriaId) query = query.eq('categoria_id', categoriaId);
    if (anioInicio) query = query.gte('anio_publicacion', anioInicio);
    if (anioFin) query = query.lte('anio_publicacion', anioFin);

    const { data } = await query;
    mostrarResultados(data);
};

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
