import {
  baseMenu,
  routesJuridicalProcesses,
} from './juridical-processes-nombres-rutas-archivos';

const JURIDICAL_PROCESSES: string[] = [
  // 'dictaminaciones-juridicas',
  'juridical-ruling',
  // 'abandono-devolucion-monitor',
  'return-abandonment-monitor',
  // 'declaracion-abandono-aseguramiento',
  'declaration-abandonment-insurance',
];

export const CREAR_MENU_JURIDICAL_PROCESSES = function () {
  var menuJuridicalProcesses = [];
  for (let index = 0; index < routesJuridicalProcesses.length; index++) {
    menuJuridicalProcesses.push({
      label: routesJuridicalProcesses[index].menu,
      link:
        baseMenu +
        routesJuridicalProcesses[index].link +
        `${
          JURIDICAL_PROCESSES.includes(routesJuridicalProcesses[index].link)
            ? '/12345'
            : ''
        }`,
    });
  }
  return menuJuridicalProcesses;
};
