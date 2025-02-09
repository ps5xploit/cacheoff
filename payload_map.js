const payload_map = [
  {
    displayTitle: 'etaHEN',
    description: '', // Dejar "description" vacío
    info: 'Descripción de etaHEN', // Mantener "info"
    fileName: 'etaHEN-20B.bin',
    author: 'LM',
    version: '?'
  },
  {
    displayTitle: 'etaHEN 1.8b',
    description: '', // Dejar "description" vacío
    info: 'Descripción de etaHEN', // Mantener "info"
    fileName: 'etaHEN-18B.bin',
    author: 'LM',
    version: '1.8b'
  },
 
  {
    displayTitle: 'HW Info',
    description: '', // Dejar "description" vacío
    info: 'Descripción de HW Info', // Mantener "info"
    fileName: 'hwinfo-tornblom.elf',
    author: '?',
    source: '?',
    version: '?'
  },
  {
    displayTitle: 'Remove Cache',
    description: '', // Dejar "description" vacío
    info: 'Descripción de Remove Cache', // Mantener "info"
    fileName: 'Browser_appCache_remove.elf',
    author: 'Storm21CH',
    version: '1.0fix'
  },
  {
    displayTitle: 'Version',
    description: '', // Dejar "description" vacío
    info: 'Descripción de Versions', // Mantener "info"
    fileName: 'versions.elf',
    author: '?',
    version: '1.0'
  },
  {
    displayTitle: 'Fan control',
    description: '', // Dejar "description" vacío
    info: 'Descripción de Fan control', // Mantener "info"
    fileName: 'fan_threshold.elf',
    author: '?',
    source: '?',
    version: '1.0'
  },
   {
            displayTitle: 'Backup DB',
            description: '', // Dejar "description" vacío
            fileName: 'BackupDB.elf',
            info: 'Make a BACKUP from db to usb', // Mantener "info"
            author: 'Make a BACKUP from db to usb',
            source: 'Make a BACKUP from db to usb',
            version: '1.1'
        },
  
{
            displayTitle: 'ELF Loader',
            description: '', // Dejar "description" vacío
            fileName: 'elfldr.elf',
            info: 'ELF Loader', // Mantener "info"
            author: 'ELF Loader',
            source: 'ELF Loader',
            version: '1.1'
        },
// {
    //     displayTitle: 'ps5-welcome',
    //     description: '',
    //     info: 'ps5-welcome',
    //     fileName: 'ps5-welcome.elf',
    //     author: 'mour0ne',
    //     version: '?'
    // },
];

// JavaScript para mostrar info en lugar de description
const btns = document.querySelectorAll('.btn');
const infoElement = document.getElementById('info'); // Obtén el elemento de info por su ID

btns.forEach(btn => {
  btn.addEventListener('mouseover', () => {
    const info = btn.getAttribute('data-info');
    infoElement.textContent = info; // Actualiza el contenido del elemento de info
  });

  btn.addEventListener('mouseout', () => {
    infoElement.textContent = ''; // Limpia el contenido cuando el ratón sale del elemento
  });
});
