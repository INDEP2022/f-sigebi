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
    link: '/pages/documentation',
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
        link: '/pages/catalogs/doc-compensation-sat-xml',
      },
      {
        label: 'Donatorios',
        link: '/pages/catalogs/grantees',
      },
    ],
  },
  //Administración
  {
    label: 'Procesos Administrativos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Numerario Operado',
        link: '/pages/administrative-processes/numerary-operator',
      },
      {
        label: 'Numerario Físico',
        link: '/pages/administrative-processes/numerary-physics',
      },
      {
        label: 'Otras Monedas',
        link: '/pages/administrative-processes/other-currencies',
      },
      {
        label: 'Valores por Expediente',
        link: '/pages/administrative-processes/values-per-file',
      },
      {
        label: 'Movimientos Cuentas General',
        link: '/pages/administrative-processes/general-account-movements',
      },
      {
        label: 'Bienes conversión',
        link: '/pages/administrative-processes/apply-lif',
      },
    ],
  },
  {
    label: 'Reportes',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Almacenes',
        link: '/pages/administrative-processes/warehouse-reports',
      },
    ],
  },
  {
    label: 'Empresas',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Resumen Info Financiera',
        link: '/pages/administrative-processes/summary-financial-info',
      },
    ],
  },

  {
    label: 'Solicitudes',
    icon: 'bx-folder',
    subItems: [],
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
  {
    label: 'Procesos Ejecutivos',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Reportes del Director Gral',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Total de documentos recibidos vs área destino',
            link: '/pages/executive-processes/pe-rddg-drpad-m-totaldoc-received-destinationarea',
          },
          {
            label: 'Reporte Documentación Recibida',
            link: '/pages/executive-processes/pe-rddg-tddr-m-report-doc-received',
          },
          {
            label: 'Reporte de bienes recibidos en administración',
            link: '/pages/executive-processes/pe-rddg-brea-m-assets-received-admon',
          },
        ],
      },
      {
        label: 'Acumulado Anual de Bienes',
        link: '/pages/executive-processes/pe-aab-m-annual-accumulated-assets',
      },
      {
        label: 'Acumulado Trimestral de Bienes',
        link: '/pages/executive-processes/pe-atb-m-quarterly-accumulated-assets',
      },
      {
        label: 'Acumulado Bienes',
        link: '/pages/executive-processes/acumulative-asset-tabs',
      },
      {
        label: 'Control Mensual de Recepción Documental',
        link: '/pages/executive-processes/pe-cmrd-m-cumulative-goods',
      },
      {
        label: 'Control diario de recepción de expedientes',
        link: '/pages/executive-processes/pe-rdde-m-daily-control-reception',
      },
      {
        label: 'información Bienes',
        link: '/pages/executive-processes/pe-ibs-d-a-m-report-registration-module',
      },
      {
        label: 'Reporte de documentación recibida por autoridad emisora ',
        link: '/pages/executive-processes/pe-drpae-m-doc-received-authority',
      },
      {
        label: 'Gestión de Autorización de Destrucción',
        link: '/pages/executive-processes/pe-gdadd-m-destruction-authorization-management',
      },
      {
        label: 'Autorización de bienes para destrucción ',
        link: '/pages/executive-processes/pe-ad-m-authorization-assets-destruction',
      },
      {
        label: 'Aprobación de bienes para destino',
        link: '/pages/executive-processes/pe-ad-m-approval-assets-destination',
      },
      {
        label: 'Recepción recibida por área en el SERA ',
        link: '/pages/executive-processes/pe-rddxdees-m-reception-area-sera',
      },
      {
        label: 'Proceso de actualización masiva de valor avaluó',
        link: '/pages/executive-processes/pe-amdvda-m-update-mss-value',
      },
      {
        label: 'Aprobación donación',
        link: '/pages/executive-processes/pe-ad-m-donation-approval',
      },
      
    ],
  },
];
