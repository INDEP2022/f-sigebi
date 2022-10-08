import { DOCUMENTS_RECEPTION_ROUTES } from '../common/constants/documents-reception-routes';
import { menuOptionsJuridicalProcesses } from '../common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
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
        label: 'Ssubtipo Bien',
        link: '/pages/catalogs/good-ssubtypes',
      },
      {
        label: 'Sssubtipo Bien',
        link: '/pages/catalogs/good-sssubtypes',
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
        label: 'Sat Clasificacion',
        link: '/pages/catalogs/sat-clasification',
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
      {
        label: 'Sat Subclasificacion',
        link: '/pages/catalogs/sat-subclasification',
      },
      {
        label: 'Servicios',
        link: '/pages/catalogs/services',
      },
      {
        label: 'Series Ifai',
        link: '/pages/catalogs/ifai-series',
      },
      {
        label: 'Situacion Bien',
        link: '/pages/catalogs/good-situation',
      },
      {
        label: 'Soporte Legal',
        link: '/pages/catalogs/legal-support',
      },
      {
        label: 'Doc. Resarcimiento Sat XML',
        link: '/pages/catalogs/doc-compensation-sat-xml',
      },
      {
        label: 'Donatorios',
        link: '/pages/catalogs/grantees',
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
      {
        label: 'Actas Conversión',
        link: '/pages/administrative-processes/conversion-act',
      },
      {
        label: 'Administración Conversión',
        link: '/pages/administrative-processes/conversion-management',
      },
      {
        label: 'Derivación Bienes',
        link: '/pages/administrative-processes/derivation-goods',
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
    label: 'Proceso Destino final',
    icon: 'bx-share-alt',
    subItems: [
      {
        label: 'Actas de Destrucción',
        link: '/pages/final-destination-process/destruction-acts',
      },
      {
        label: 'Actas de Donación',
        link: '/pages/final-destination-process/donation-acts',
      },
      {
        label: 'Actas de Destino',
        link: '/pages/final-destination-process/destination-acts',
      },
    ],
  },
  ...DOCUMENTS_RECEPTION_ROUTES,
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
  {
    label: 'Comercialización',
    icon: 'bx-folder',
    subItems: [
      {
        label: 'Bienes Muebles',
        icon: 'bx-folder',
        subItems: [
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/c-b-bedv-m-validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/c-b-rdodi-m-reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/c-b-vdp-m-payment-dispersion-validation',
          },
          {
            label: 'Conversión a numerario',
            link: '/pages/commercialization/numeraire-conversion-tabs',
          },
          {
            label: 'Consulta de Avalúo',
            link: '/pages/commercialization/c-b-a-cda-m-appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/c-b-a-rda-m-appraisal-registration',
          },
        ],
      },
      {
        label: 'Bienes Inmuebles',
        icon: 'home-outline',
        subItems: [
          {
            label: 'Bienes exentos de validación',
            link: '/pages/commercialization/c-b-bedv-m-validation-exempted-goods',
          },
          {
            label: 'Reclasificacón OI',
            link: '/pages/commercialization/c-b-rdodi-m-reclass-recovery-orders',
          },
          {
            label: 'Validación de Pagos',
            link: '/pages/commercialization/c-b-vdp-m-payment-dispersion-validation',
          },
          {
            label: 'Conversión a numerario',
            link: '/pages/commercialization/numeraire-conversion-tabs',
          },
          {
            label: 'Consulta de Avalúo',
            link: '/pages/commercialization/c-b-a-cda-m-appraisal-consultation',
          },
          {
            label: 'Registro de Avalúo',
            link: '/pages/commercialization/c-b-a-rda-m-appraisal-registration',
          },
        ],
      },

      {
        label: 'Activos Financieros',
        icon: 'credit-card-outline',
        subItems:[
        ]
      },
      {
        label: 'Catálogos',
        icon: 'folder',
        subItems:[
        ]
      }
      
    ]
  },
  // PROCESOS JURIDICOS
  menuOptionsJuridicalProcesses,
  // PROCESOS JURIDICOS
];
