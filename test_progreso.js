const puppeteer = require('puppeteer');

async function testProgreso() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Navegando a la aplicación...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('⏳ Esperando carga completa...');
    await page.waitForSelector('.nav-item', { timeout: 10000 });
    
    console.log('📊 Clickeando en la sección Progreso...');
    // Buscar el botón de progreso (segundo ítem de navegación)
    await page.click('.nav-item[data-section="progreso"], .nav-item:nth-child(2)');
    
    console.log('⏳ Esperando carga de progreso...');
    await page.waitForTimeout(3000);
    
    console.log('🔍 Buscando contadores de decretos...');
    // Buscar elementos que contengan información de decretos
    const decretoElements = await page.$$eval('[class*="decreto"], .area-card, .progress-item', 
      elements => elements.map(el => ({
        text: el.textContent,
        classes: el.className,
        innerHTML: el.innerHTML.substring(0, 200)
      }))
    );
    
    console.log('📋 Elementos encontrados:', decretoElements);
    
    // Buscar específicamente texto que contenga "decreto" o contadores
    const pageContent = await page.content();
    const hasDecretoCount = pageContent.includes('decreto') || pageContent.includes('📋');
    
    console.log('📊 ¿Contiene contadores de decretos?', hasDecretoCount);
    
    if (hasDecretoCount) {
      console.log('✅ ¡Contadores de decretos encontrados en la página!');
    } else {
      console.log('❌ No se encontraron contadores de decretos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testProgreso();