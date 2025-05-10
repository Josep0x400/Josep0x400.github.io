const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const { createClient } = supabase;
const client = supabase.createClient(supabaseUrl, supabaseKey);

// Configuración de paginación
let paginaActual = 1;
const porPagina = 8; // Cambiado de 9 a 8

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
      .select('*, Autores:autor_id(nombre_autor), Categorias:categoria_id(nombre_categoria)', { count: 'exact' });
    
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
    document.getElementById('resultados').innerHTML = `<p class="error">Error al cargar resultados: ${error.message}</p>`;
  }
}

// Mostrar resultados (asumiendo que esta función ya está implementada)
function mostrarResultados(data) {
  // Código existente para mostrar resultados
}

// Función actualizada para controlar la paginación
function actualizarPaginacion(count) {
  const totalPaginas = Math.ceil(count / porPagina);
  const controlesPaginacion = document.querySelector('.controles-paginacion');
  
  // Ocultar controles de paginación si hay 8 o menos elementos en total
  if (count <= porPagina) {
    controlesPaginacion.style.display = 'none';
    return;
  }
  
  // Mostrar controles de paginación si hay más de 8 elementos
  controlesPaginacion.style.display = 'block';
  
  // Actualizar el estado de los botones de navegación
  const btnAnterior = document.querySelector('.boton-anterior'); // Ajustar según la clase real
  const btnSiguiente = document.querySelector('.boton-siguiente'); // Ajustar según la clase real
  
  if (btnAnterior && btnSiguiente) {
    btnAnterior.disabled = (paginaActual === 1);
    btnSiguiente.disabled = (paginaActual === totalPaginas);
  }
  
  // Opcionalmente, actualizar texto de información de paginación
  const infoPaginacion = document.querySelector('.info-paginacion'); // Ajustar según la clase real
  if (infoPaginacion) {
    infoPaginacion.textContent = `Página ${paginaActual} de ${totalPaginas} (${count} resultados)`;
  }
}

// Funciones para navegar entre páginas (asumiendo que ya están implementadas)
function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    cargarResultados();
  }
}

function paginaSiguiente() {
  paginaActual++;
  cargarResultados();
}
