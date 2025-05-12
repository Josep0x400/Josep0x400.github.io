document.addEventListener('DOMContentLoaded', function() {
    const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
    const { createClient } = supabase;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', iniciarSesion);
    }

    async function iniciarSesion(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Buscar usuario en la tabla socios con email y contraseña
            const { data, error } = await supabaseClient
                .from('socios')
                .select('*')
                .eq('email', email)
                .eq('contrasena', password)
                .single();

            if (error || !data) {
                alert('Usuario o contraseña incorrectos');
                return;
            }

            sessionStorage.setItem('nombreSocio', data.nombre_socio);
            sessionStorage.setItem('emailSocio', data.email);
            window.location.href = 'home.html';
        } catch (err) {
            console.error('Error inesperado:', err);
            alert('Error inesperado. Por favor, intenta de nuevo.');
        }
    }
});
