const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Define la ruta del directorio fuente y de destino
const sourceDir = 'src';
const destinationDir = 'dist';

// Define la función para copiar los archivos estáticos
function copyFiles(source, destination) {
  const isWindows = os.platform() === 'win32';

  // Eliminar el directorio de destino si existe
  if (fs.existsSync(destination)) {
    if (isWindows) {
      execSync(`rmdir /S /Q ${destination}`);
    } else {
      execSync(`rm -rf ${destination}`);
    }
  }

  // Crear directorio de destino
  if (isWindows) {
    execSync(`mkdir ${path.resolve(destination)}`);
  } else {
    execSync(`mkdir -p ${destination}`);
  }

  // Leer contenido de src
  const files = fs.readdirSync(source);

  // Iterar sobre cada elemento de src
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);
    
    // Verificar si es un archivo o un directorio
    if (fs.statSync(sourcePath).isDirectory()) {
      // Si es un directorio, llamamos a la función de copia recursivamente
      copyFiles(sourcePath, destinationPath);
    } else {
      // Si es un archivo, copiamos solo si no es un archivo .ts
      if (!file.endsWith('.ts')) {
        // Copiar archivo estático
        if (isWindows) {
          execSync(`copy "${sourcePath}" "${destinationPath}"`);
        } else {
          execSync(`cp "${sourcePath}" "${destinationPath}"`);
        }
      }
    }
  }
}

// Función para eliminar archivos .js en src
function deleteJsFiles(source) {
  const files = fs.readdirSync(source);

  // Iterar sobre los archivos y eliminar los .js
  for (const file of files) {
    const filePath = path.join(source, file);
    if (fs.statSync(filePath).isDirectory()) {
      deleteJsFiles(filePath); // Recursión en subdirectorio
    } else if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
      fs.unlinkSync(filePath); // Eliminar archivo
    }
  }
}

// Llamar a la función para iniciar la copia
copyFiles(sourceDir, destinationDir);
// Llamar a la función para eliminar los archivos .js de src
deleteJsFiles(sourceDir);

console.log('Archivos estáticos copiados y archivos .js eliminados de "src".');
