document.addEventListener('DOMContentLoaded', function() {
    const supabaseUrl = 'https://fzqiuqsnjlxodozrmtvp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cWl1cXNuamx4b2RvenJtdHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA5NTYsImV4cCI6MjA2MDgzNjk1Nn0.ATYMIUqudjT1DPTSikIO_UFif00PDaOhUKUAqDOkc3w';
    const { createClient } = supabase;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', registrarUsuario);
    }

    async function registrarUsuario(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Insertar en la tabla socios
            const { data, error } = await supabaseClient
                .from('socios')
                .insert([{
                    nombre_socio: nombre,
                    email: email,
                    contrasena: password
                }])
                .select();

            if (error) throw error;

            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }
});
