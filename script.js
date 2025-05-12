function buscarRapida() {
    const termino = document.getElementById('busqueda-rapida').value.trim();
    if (termino.length === 0) {
        alert('Ingresa un término para buscar.');
        return;
    }
    // Redirige a resultados.html con el parámetro de búsqueda
    window.location.href = `resultados.html?busqueda=${encodeURIComponent(termino)}`;
}
