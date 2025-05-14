// Configuración de Supabase
const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function cargarAutores() {
  const { data } = await supabaseClient
    .from('Autores')
    .select('autor_id, nombre_autor')
    .order('nombre_autor', { ascending: true });

  const select = document.getElementById('filtro-autor');
  if (data) {
    data.forEach(autor => {
      const option = document.createElement('option');
      option.value = autor.autor_id;
      option.textContent = autor.nombre_autor;
      select.appendChild(option);
    });
  }
}

async function cargarCategorias() {
  const { data } = await supabaseClient
    .from('Categorias')
    .select('categoria_id, nombre_categoria')
    .order('nombre_categoria', { ascending: true });

  const select = document.getElementById('filtro-categoria');
  if (data) {
    data.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.categoria_id;
      option.textContent = cat.nombre_categoria;
      select.appendChild(option);
    });
  }
}

async function cargarAnios() {
  // Obtener todas las fechas de publicación
  const { data, error } = await supabaseClient
    .from('Libros')
    .select('anio_publicacion')
    .order('anio_publicacion', { ascending: false });

  if (error) {
    console.error('Error al cargar años:', error);
    return;
  }

  // Extraer los años únicos
  const aniosSet = new Set();
  data.forEach(libro => {
    if (libro.anio_publicacion) {
      const year = libro.anio_publicacion.substring(0, 4);
      aniosSet.add(year);
    }
  });
  const anios = Array.from(aniosSet).sort((a, b) => b - a); // Descendente

  // Llenar los selects
  const selectInicio = document.getElementById('filtro-anio-inicio');
  const selectFin = document.getElementById('filtro-anio-fin');

  // Limpiar opciones previas
  selectInicio.innerHTML = '<option value="">Desde</option>';
  selectFin.innerHTML = '<option value="">Hasta</option>';

  anios.forEach(anio => {
    const option1 = document.createElement('option');
    option1.value = `${anio}-01-01`;
    option1.textContent = anio;
    selectInicio.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = `${anio}-12-31`;
    option2.textContent = anio;
    selectFin.appendChild(option2);
  });
}

// Cargar filtros al iniciar
window.onload = function() {
  cargarAutores();
  cargarCategorias();
  cargarAnios();
};
