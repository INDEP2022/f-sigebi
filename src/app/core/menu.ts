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
        label: 'Lotes',
        link: '/pages/catalogs/batch',
      },
      {
        label: 'Medio Fotografía',
        link: '/pages/catalogs/photograph-media',
      },
      {
        label: 'Medio Imagen',
        link: '/pages/catalogs/image-media',
      },
      {
        label: 'MinPub',
        link: '/pages/catalogs/minpub',
      },
      {
        label: 'Motivo Revisión',
        link: '/pages/catalogs/revision-reason',
      },
      {
        label: 'Motivo No Entrega',
        link: '/pages/catalogs/non-delivery-reasons',
      },
      {
        label: 'Municipios',
        link: '/pages/catalogs/municipalities',
      },
      {
        label: 'Normas',
        link: '/pages/catalogs/norms',
      },
      {
        label: 'Notarios',
        link: '/pages/catalogs/notary',
      },
      {
        label: 'Párrafos',
        link: '/pages/catalogs/paragraphs',
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
