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
        label: 'Deductivas',
        link: '/pages/catalogs/deductives',
      },
      {
        label: 'Deductivas Verificacion',
        link: '/pages/catalogs/deductives-verification',
      },
      {
        label: 'Delegaciones Estado',
        link: '/pages/catalogs/delegations-state',
      },
      {
        label: 'Delegaciones Regionales',
        link: '/pages/catalogs/regional-delegations',
      },
      {
        label: 'Departamentos',
        link: '/pages/catalogs/departments',
      },
      {
        label: 'Despachos',
        link: '/pages/catalogs/offices',
      },
      {
        label: 'Detalle Delegacion',
        link: '/pages/catalogs/detail-delegation',
      },
      {
        label: 'Dictamenes',
        link: '/pages/catalogs/opinions',
      },
      {
        label: 'Documentos Resarsimiento',
        link: '/pages/catalogs/doc-compensation',
      },
      {
        label: 'Leyendas',
        link: '/pages/catalogs/legends',
      },
      {
        label: 'Estados',
        link: '/pages/catalogs/states',
      },
      {
        label: 'Abogados',
        link: '/pages/catalogs/lawyer',
      },
      {
        label: 'Aclaraciónes',
        link: '/pages/catalogs/clarifications',
      },
      {
        label: 'Bodegas',
        link: '/pages/catalogs/warehouses',
      },
      {
        label: 'Bancos',
        link: '/pages/catalogs/banks',
      },
      {
        label: 'Bóveda',
        link: '/pages/catalogs/vault',
      },
      {
        label: 'Bodegas',
        link: '/pages/catalogs/storehouses',
      },
      {
        label: 'Ciudades',
        link: '/pages/catalogs/cities',
      },
      {
        label: 'Concepto de Pagos',
        link: '/pages/catalogs/payment-concept',
      },
      {
        label: 'Institución Clasificación',
        link: '/pages/catalogs/intitution-classification',
      },
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
        label: 'Peritos',
        link: '/pages/catalogs/expert',
      },
      {
        label: 'Personas',
        link: '/pages/catalogs/person',
      },
      {
        label: 'Procedenias',
        link: '/pages/catalogs/oring',
      },
      {
        label: 'Procedencias Cisi',
        link: '/pages/catalogs/oringCisi',
      },
      {
        label: 'Procesos Sisi',
        link: '/pages/catalogs/processSisi',
      }, 
      {
        label: 'R Asunt Dic',
        link: '/pages/catalogs/rAsuntDic',
      },
      {
        label: 'Estantes',
        link: '/pages/catalogs/rack',
      },
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
