import { routesSecurity } from './rutas-nombres-pantallas-security';

export const baseMenuSecurity: string = '/pages/seguridad/'; // Base url Menu
export const MENU_OPTIONS_SECURITY = [
  // SEGURIDAD
  {
    label: 'Seguridad',
    icon: 'bx-share-alt',
    subItems: [
      {
        // Calendario de Contraseñas
        label: routesSecurity[0].menu,
        link: baseMenuSecurity + routesSecurity[0].link,
      },
      {
        // Acceso al Sistema
        label: routesSecurity[1].menu,
        link: baseMenuSecurity + routesSecurity[1].link,
      },
      {
        // Cambio de Contraseñas
        label: routesSecurity[2].menu,
        link: baseMenuSecurity + routesSecurity[2].link,
      },
    ],
  },
  // SEGURIDAD
];
