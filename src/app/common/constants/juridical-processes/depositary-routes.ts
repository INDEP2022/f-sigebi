import { DEPOSITARY_ROUTES_1 } from './depositary-routes-1';
import { DEPOSITARY_ROUTES_2 } from './depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
  baseMenuProcesoDispercionPagos,
} from './juridical-processes-nombres-rutas-archivos';

const DISPERSION_PAGOS: string[] = [
  'conciliation-depositary-payments',
  'query-related-payments-depositories',
  'dispersal-depositary-payments',
  // 'conciliacion-pagos-depositaria',
  // 'consulta-pagos-relacionados-depositaria',
];

export const CREAR_MENU_DEPOSITARY = function () {
  var menuDepositary = [];
  for (let index = 0; index < DEPOSITARY_ROUTES_1.length; index++) {
    var linkUrl = '';
    if (DISPERSION_PAGOS.includes(DEPOSITARY_ROUTES_1[index].link)) {
      linkUrl =
        baseMenu +
        baseMenuDepositaria +
        baseMenuProcesoDispercionPagos +
        DEPOSITARY_ROUTES_1[index].link;
    } else {
      linkUrl =
        baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_1[index].link;
    }
    menuDepositary.push({
      label: DEPOSITARY_ROUTES_1[index].menu,
      link: linkUrl,
    });
  }
  for (let index = 0; index < DEPOSITARY_ROUTES_2.length; index++) {
    menuDepositary.push({
      label: DEPOSITARY_ROUTES_2[index].menu,
      link: baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[index].link,
    });
  }
  menuDepositary.push({
    label: 'Notificación de Abandono',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Por Aseguramiento',
        link: baseMenu + baseMenuDepositaria + 'notice-abandonment/S',
      },
      {
        label: 'Por Devolución',
        link: baseMenu + baseMenuDepositaria + 'notice-abandonment/D',
      },
    ],
  });
  return menuDepositary;
};
