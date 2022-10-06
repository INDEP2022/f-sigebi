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
        label: 'Tipo Docto',
        link: '/pages/catalogs/type-docto',
      },
      {
        label: 'Tipo Siniestro',
        link: '/pages/catalogs/type-sinister',
      },
      {
        label: 'Tipo de Almacenes',
        link: '/pages/catalogs/type-wharehouse',
      },
      {
        label: 'Tipo de Servicios',
        link: '/pages/catalogs/type-services',
      },
      {
        label: 'Tipo order servicio',
        link: '/pages/catalogs/type-order-service',
      },
      {
        label: 'Tipo relevante',
        link: '/pages/catalogs/type-relevant',
      },
      {
        label: 'Zona Geográficas',
        link: '/pages/catalogs/zone-geographic',
      },
      {
        label: 'Conclusion siniestros',
        link: '/pages/catalogs/claim-conclusion',
      },
      {
        label: 'Código estado',
        link: '/pages/catalogs/status-code',
      },
      {
        label: 'Documentos resarcimiento sat',
        link: '/pages/catalogs/doc-compensation-sat',
      },
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
];
