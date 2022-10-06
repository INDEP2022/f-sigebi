import { menuOpcionesProcesosJuridicos } from '../pages/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { IMenuItem } from './interfaces/menu.interface';

export const MENU: IMenuItem[] = [
  {
    label: 'Menu',
    isTitle: true,
  },
  {
    label: 'Inicio',
    icon: 'bx-home-circle',
    link: '/pages/home',
  },
  // {
  //     isLayout: true
  // },
  // {
  //     label: 'Aplicaciones',
  //     isTitle: true
  // },
    {
      label: 'Documentation',
      icon: 'bx-home-circle',
      link: '/pages/documentation'
  },
  {
    label: 'Ejemplo',
    icon: 'bx-calendar',
    link: '/pages/example',
  },
  {
    label: 'Catalogos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Tipo Bien',
        link: '/pages/catalogs/good-types',
      },
      {
        label: 'Subtipo Bien',
        link: '/pages/catalogs/good-subtypes',
      },
      {
        label: 'Delegacion',
        link: '/pages/catalogs/delegations',
      },
      {
        label: 'Sub Delegacion',
        link: '/pages/catalogs/sub-delegations',
      },
      {
        label: 'Doc. Resarcimiento Sat XML',
        link: '/pages/catalogs/doc-compensation-sat-xml'
      },
      {
        label: 'Donatorios',
        link: '/pages/catalogs/grantees'
      }
    ],
  },
  {
    label: 'Multi nivel',
    icon: 'bx-share-alt',
    subItems: [
      {
        label: 'Nivel 1.1',
        link: '#',
      },
      {
        label: 'Nivel 1.2',
        subItems: [
          {
            label: 'Nivel 2.1',
          },
          {
            label: 'Nivel 2.2',
          },
        ],
      },
    ],
  },
  menuOpcionesProcesosJuridicos[0]
  // // PROCESOS JURIDICOS
  // {
  //   label: 'Procesos Jurídicos',
  //   icon: 'bx-share-alt',
  //   subItems: [
  //     {
  //       label: 'Dictaminaciones Juridicas',
  //       link: '/pages/juridicos/dictaminaciones-juridicas',
  //     },
  //     {
  //       label: 'Dictaminaciones Juridicas',
  //       link: '/pages/juridicos/dictaminaciones-juridicas',
  //     },
  //     {
  //       label: 'Dictaminaciones Juridicas',
  //       link: '/pages/juridicos/dictaminaciones-juridicas',
  //     },
  //     {
  //       label: 'Nivel 1.2',
  //       subItems: [
  //         {
  //           label: 'Nivel 2.1',
  //         },
  //         {
  //           label: 'Nivel 2.2',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // // PROCESOS JURIDICOS

];
