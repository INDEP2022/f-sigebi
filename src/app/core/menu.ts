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

        label: 'Etiquetas Bien',
        link: '/pages/catalogs/label-okey',
      },
      {
        label: 'Fracciones',
        link: '/pages/catalogs/fractions',
      },
      {
        label: 'Gavetas',
        link: '/pages/catalogs/drawers',
      },
      {
        label: 'Gestión',
        link: '/pages/catalogs/management',
      },
      {
        label: 'Guarda Valores',
        link: '/pages/catalogs/save-values',
      },

      {
        label: 'Identificador',
        link: '/pages/catalogs/identifier',
      },

      {
        label: 'Indiciados',
        link: '/pages/catalogs/indicated',
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
    label: 'Solicitudes',
    icon: 'bx-folder',
    subItems: [

    ]
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
];
