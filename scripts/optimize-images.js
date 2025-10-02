/**
 * Script de Optimización de Imágenes para Nonino
 *
 * Convierte imágenes pesadas a WebP responsive con blur placeholders
 * Reducción esperada: ~96% del tamaño original
 *
 * Uso: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const SIZES = [640, 1024, 1920, 2560]; // Breakpoints responsive
const QUALITY = 85; // Calidad WebP (85 = excelente balance)
const BLUR_WIDTH = 20; // Ancho del placeholder blur
const BLUR_QUALITY = 20; // Calidad muy baja para placeholder

const imagesDir = path.join(__dirname, '../src/assets/images');
const outputDir = path.join(__dirname, '../src/assets/images/optimized');

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Imágenes prioritarias para optimizar (ordenadas por impacto)
const imagesToOptimize = [
  { file: 'SanMartin.jpg', priority: 'CRÍTICO', usage: 'Hero HomePage' },
  { file: 'parallax3.jpg', priority: 'ALTO', usage: 'Parallax sections' },
  { file: 'localRuta40.jpg', priority: 'ALTO', usage: 'StoresPage' },
  { file: 'parallax0.jpg', priority: 'ALTO', usage: 'Parallax sections' },
  { file: 'nonino_lateral.jpg', priority: 'MEDIO', usage: 'About/Contact' },
  { file: 'parallax4.jpg', priority: 'MEDIO', usage: 'Parallax sections' },
  { file: 'parallax6.jpg', priority: 'MEDIO', usage: 'Parallax sections' },
  { file: 'parallax5.jpg', priority: 'MEDIO', usage: 'Parallax sections' },
  { file: 'parallax2.jpg', priority: 'MEDIO', usage: 'Parallax sections' },
  { file: 'SanMartin2.jpg', priority: 'MEDIO', usage: 'Features section' },
  { file: 'somos2.jpg', priority: 'BAJO', usage: 'AboutPage' },
  { file: 'Fabrica.jpg', priority: 'BAJO', usage: 'StoresPage' },
  { file: 'somos.jpg', priority: 'BAJO', usage: 'AboutPage' },
  { file: 'somos3.jpg', priority: 'BAJO', usage: 'AboutPage' },
];

/**
 * Optimiza una imagen individual
 */
async function optimizeImage(imageConfig) {
  const { file, priority, usage } = imageConfig;
  const inputPath = path.join(imagesDir, file);

  // Verificar que el archivo existe
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${file} no encontrado, saltando...`);
    return;
  }

  const baseName = path.parse(file).name;
  const inputStats = fs.statSync(inputPath);
  const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

  console.log(`\n🔄 [${priority}] Optimizando ${file} (${inputSizeMB}MB)`);
  console.log(`   Uso: ${usage}`);

  let totalSaved = 0;

  try {
    // 1. Generar versiones responsive
    for (const width of SIZES) {
      const outputPath = path.join(outputDir, `${baseName}-${width}w.webp`);

      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
          kernel: sharp.kernel.lanczos3 // Mejor calidad en redimensionado
        })
        .webp({
          quality: QUALITY,
          effort: 6 // Máxima compresión (0-6)
        })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizekb = (stats.size / 1024).toFixed(2);
      totalSaved += inputStats.size - stats.size;

      console.log(`   ✅ ${baseName}-${width}w.webp - ${sizekb}KB`);
    }

    // 2. Generar blur placeholder (LQIP - Low Quality Image Placeholder)
    const blurPath = path.join(outputDir, `${baseName}-blur.webp`);
    await sharp(inputPath)
      .resize(BLUR_WIDTH, null, { fit: 'inside' })
      .blur(2) // Añadir blur adicional
      .webp({ quality: BLUR_QUALITY })
      .toFile(blurPath);

    const blurStats = fs.statSync(blurPath);
    console.log(`   🌫️  ${baseName}-blur.webp - ${(blurStats.size / 1024).toFixed(2)}KB (placeholder)`);

    // 3. Calcular ahorro
    const savedMB = (totalSaved / 1024 / 1024).toFixed(2);
    const percentage = ((totalSaved / inputStats.size) * 100).toFixed(1);
    console.log(`   💾 Ahorro: ${savedMB}MB (${percentage}%)`);

  } catch (error) {
    console.error(`   ❌ Error procesando ${file}:`, error.message);
  }
}

/**
 * Genera archivo de índice con rutas optimizadas
 */
function generateImageIndex() {
  const indexPath = path.join(outputDir, 'index.js');

  let indexContent = `/**
 * Índice de imágenes optimizadas
 * Auto-generado por scripts/optimize-images.js
 */

`;

  imagesToOptimize.forEach(({ file }) => {
    const baseName = path.parse(file).name;
    indexContent += `// ${file}\n`;
    indexContent += `export const ${baseName}Blur = new URL('./${baseName}-blur.webp', import.meta.url).href;\n`;
    indexContent += `export const ${baseName}640 = new URL('./${baseName}-640w.webp', import.meta.url).href;\n`;
    indexContent += `export const ${baseName}1024 = new URL('./${baseName}-1024w.webp', import.meta.url).href;\n`;
    indexContent += `export const ${baseName}1920 = new URL('./${baseName}-1920w.webp', import.meta.url).href;\n`;
    indexContent += `export const ${baseName}2560 = new URL('./${baseName}-2560w.webp', import.meta.url).href;\n\n`;
  });

  fs.writeFileSync(indexPath, indexContent);
  console.log('\n📄 Índice de imágenes generado: src/assets/images/optimized/index.js');
}

/**
 * Script principal
 */
(async () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     🚀 OPTIMIZADOR DE IMÁGENES - NONINO EMPANADAS     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📊 Configuración:');
  console.log(`   • Tamaños: ${SIZES.join('w, ')}w`);
  console.log(`   • Formato: WebP @ ${QUALITY}% quality`);
  console.log(`   • Blur placeholder: ${BLUR_WIDTH}px @ ${BLUR_QUALITY}% quality`);
  console.log(`   • Total de imágenes: ${imagesToOptimize.length}`);
  console.log('');

  const startTime = Date.now();
  let processedCount = 0;

  // Procesar por prioridad
  const priorities = ['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'];

  for (const priority of priorities) {
    const images = imagesToOptimize.filter(img => img.priority === priority);

    if (images.length > 0) {
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`  PROCESANDO: ${priority} (${images.length} imágenes)`);
      console.log('═'.repeat(60));

      for (const image of images) {
        await optimizeImage(image);
        processedCount++;
      }
    }
  }

  // Generar índice
  generateImageIndex();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  ✨ ¡OPTIMIZACIÓN COMPLETA! ✨          ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ ${processedCount} imágenes procesadas en ${duration}s`);
  console.log(`📁 Salida: ${outputDir}`);
  console.log('');
  console.log('📝 Próximos pasos:');
  console.log('   1. Importar imágenes desde: @/assets/images/optimized');
  console.log('   2. Usar componente <OptimizedImage> para responsive images');
  console.log('   3. Verificar resultados en navegador');
  console.log('');
})();
