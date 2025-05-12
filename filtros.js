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
