// Configuración de Supabase
const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Función para actualizar nombre y contraseña en la tabla socios
async function actualizarDatosTabla(nombre, contrasena) {
    const mensajeDiv = document.getElementById('mensaje');
    // Obtener el usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        mensajeDiv.innerHTML = '<div class="alert alert-danger">No se pudo obtener el usuario autenticado.</div>';
        return;
    }

    const email = user.email;

    // Actualizar el nombre y la contraseña en la tabla socios
    const { error: updateError } = await supabase
        .from('socios')
        .update({ 
            nombre_socio: nombre,
            contrasena: contrasena
        })
        .eq('email', email);

    if (updateError) {
        mensajeDiv.innerHTML = '<div class="alert alert-danger">Error al actualizar los datos.</div>';
        return;
    }

    mensajeDiv.innerHTML = '<div class="alert alert-success">¡Datos actualizados correctamente en la tabla!</div>';
    setTimeout(() => {
    cerrarSesion();
    }, 3000); // Espera 2 segundos antes de cerrar sesión y redirigir


}

// Vincula el formulario con la función
document.getElementById('cambiarDatosForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const mensajeDiv = document.getElementById('mensaje');

    if (contrasena !== confirmarContrasena) {
        mensajeDiv.innerHTML = '<div class="alert alert-danger">Las contraseñas no coinciden.</div>';
        return;
    }
    if (contrasena.length < 6) {
        mensajeDiv.innerHTML = '<div class="alert alert-danger">La contraseña debe tener al menos 6 caracteres.</div>';
        return;
    }

    await actualizarDatosTabla(nombre, contrasena);
});


function cerrarSesion() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }