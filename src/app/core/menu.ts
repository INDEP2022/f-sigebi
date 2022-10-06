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
    label: 'Procesos Administrativos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Numerario Operado',
        link: '/pages/administrative-processes/numerary-operator',
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
  // menuOpcionesProcesosJuridicos[0]
  
    //Procesos jurídicos
    {
      label: 'PROCESOS JURÍDICOS',
      icon: 'grid-outline',
      subItems: [
        {
          label: 'DICTAMINACIONES JURÍDICAS',
          link: '/pages/legal-processes/fact-jur-dict-amas'
        },
        // {
        //   label: 'ACTUALIZACIÓN DE EXPEDIENTES',
        //   link: '/pages/legal-processes/fact-gen-act-datex'
        // },
        {
          label: 'ACTUALIZACIÓN DEL EXPEDIENTE EN NOTIFICACIÓN',
          link: '/pages/legal-processes/fact-gen-exped-notif'
        },
        {
          label: 'ABANDONOS',
          link: '/pages/legal-processes/fact-jur-abandonos'
        },
        {
        label: 'DEPOSITARÍA',
        subItems: [
          // {
          //   label: 'SOLICITUD',
          //   subItems: [
          //     {
          //       label: 'MONITOR DE DESPOSITARÍA',
          //       link: '/pages/legal-processes/fact-adb-sol-dest-leg'
          //     },
          //   ]
          // },
          {
            label: 'REGISTRO DE DEPOSITARIA',
            link: '/pages/legal-processes/fact-jurreg-dest-leg'
          },
          // {
          //   label: 'CONCILIACIÓN DE PAGOS DEPOSITARIAS',
          //   link: '/pages/legal-processes/fact-condepo-concil-pag'
          // },
          // {
          //   label: 'PROCESO DE DISPERCIÓN DE PAGOS',
          //   link: '/pages/legal-processes/fact-con-depo-dis-pagos'
          // },
          // {
          //   label: 'REPORTE DE CÉDULA DE NOMBRAMIENTO',
          //   link: '/pages/legal-processes/fact-ger-dir-nombra-depo'
          // },
          // {
          //   label: 'REPORTE DE BIENES POR DEPOSITARÍA',
          //   link: '/pages/legal-processes/fact-gena-db-bienes-dep'
          // },
          // {
          //   label: 'EMISIÓN DE ACUERDOS',
          //   link: '/pages/legal-processes/fact-jur-emision-acu'
          // },
          // {
          //   label: 'RELACIÓN DE AMPAROS',
          //   link: '/pages/legal-processes/fact-jur-bienes-x-amp'
          // },
          // {
          //   label: 'NOTIFICACIONES POR EXPEDIENTE',
          //   link: '/pages/legal-processes/fact-conjur-noti-poster'
          // },
          // {
          //   label: 'DICTAMINACIÓN MASIVA PROG. DESALOJO',
          //   link: '/pages/legal-processes/fact-carga-mas-desahogo'
          // },
          // {
          //   label: 'VALIDACIÓN DE POSESIÓN',
          //   link: '/pages/legal-processes/fact-bie-val-pos-tercero'
          // },
        ],
      },
      // {
      //   label: 'COMPROBACIÓN DE DOC. PARA RECURSOS REVISIÓN',
      //   link: '/pages/legal-processes/fact-jur-dictam-recr'
      // },
      // {
      //   label: 'RESOLUCIÓN DE RECURSOS DE REVISIÓN',
      //   link: '/pages/legal-processes/fact-jurresore-crev'
      // },
      // {
      //   label: 'REPORTE DE RECURSOS DE REVISIÓN',
      //   link: '/pages/legal-processes/fact-ger-jurrec-derev'
      // },
      ]
    },
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
