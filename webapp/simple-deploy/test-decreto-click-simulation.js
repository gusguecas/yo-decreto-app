// Script para simular clic en decreto después de que la aplicación cargue
console.log('🧪 Simulador de clic en decreto iniciado...')

// Esperar a que la aplicación cargue completamente
let intentos = 0
const maxIntentos = 20

function esperarYHacerClick() {
    intentos++
    console.log(`🔄 Intento ${intentos}: Buscando decretos...`)
    
    // Buscar decretos en la página
    const decretoCards = document.querySelectorAll('.decreto-card')
    
    if (decretoCards.length > 0) {
        console.log(`✅ Encontrados ${decretoCards.length} decretos`)
        
        // Hacer clic en el primer decreto
        const primerDecreto = decretoCards[0]
        console.log('🖱️ Haciendo clic en el primer decreto...')
        
        // Simular clic
        primerDecreto.click()
        
        // Verificar si cambió la vista después del clic
        setTimeout(() => {
            console.log('🔍 Verificando cambio de vista...')
            const volverBtn = document.querySelector('button[onclick*="volverALista"]')
            if (volverBtn) {
                console.log('✅ ¡Vista de detalle cargada correctamente!')
            } else {
                console.log('❌ La vista de detalle no se cargó')
            }
        }, 2000)
        
    } else if (intentos < maxIntentos) {
        console.log('⏳ No se encontraron decretos aún, reintentando...')
        setTimeout(esperarYHacerClick, 1000)
    } else {
        console.log('❌ No se encontraron decretos después de múltiples intentos')
    }
}

// Iniciar la búsqueda después de un momento
setTimeout(esperarYHacerClick, 3000)