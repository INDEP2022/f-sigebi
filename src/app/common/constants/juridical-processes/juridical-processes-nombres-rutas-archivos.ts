export const baseMenu: string = '/pages/juridicos/'; // Base url Menu
export const baseMenuDepositaria: string = 'depositaria/'; // Base url Menu Depositaria
export const baseMenuProcesoDispercionPagos: string =
  'procesos-dispercion-pagos/'; // Base url Menu ProcesoDispercionPagos
// NOMBRE PANTALLA, LINK NOMBRE PANTALLA EN INGLES, NOMBRE OPCION MENU
export const routesJuridicalProcesses: any = [
  {
    // DICTAMINACIONES JURIDICAS
    label: 'Dictaminaciones Juridicas',
    link: 'dictaminaciones-juridicas',
    menu: 'Dictaminaciones Juridicas',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE
    label: 'Actualización de Datos del Expediente',
    link: 'actualizacion-datos-expediente',
    menu: 'Actualización de Expediente',
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
    label: 'Actualización de Expedientes en Notificación',
    link: 'actualizacion-expedientes-notificacion',
    menu: 'Actualización de Expedientes en Notificación',
  },
  {
    // DECLARATORIA Y OFICIOS DE ABANDONOS
    label: 'Declaratoria y Oficios de Abandonos',
    link: 'abandonos',
    menu: 'Abandonos',
  },
  // DEPOSITARIA
  {
    // REGISTRO DE DEPOSITARIA
    label: 'Nombranientos',
    link: 'registro-depositaria',
    menu: 'Registro de Depositaría',
  },
  {
    // CONCILIACIÓN DE DISPERCIÓN DE PAGOS
    label: 'Conciliación de Pagos Depositarias',
    link: 'conciliacion-pagos-depositaria',
    menu: 'Proceso de Disperción de Pagos',
  },
  {
    // VALIDACIÓN DE PAGOS
    label: 'Consulta de Pagos Relacionados Depositarias',
    link: 'consulta-pagos-relacionados-depositaria',
    menu: 'Validación de Pagos',
  },
  {
    // SOLICITUD/MONITOR DE DEPOSITARIA
    label: 'Solicitud de Destino Legal para el Bien',
    link: 'solicitud-monitor-depositaria',
    menu: 'Solicitud/Monitor de Depositaría',
  },
  {
    // REPORTE DE CÉDULAS DE NOMBRAMIENTO
    label: 'Reporte de Cédulas de Nombramiento',
    link: 'reporte-cedulas-nombramiento',
    menu: 'Reporte de Cédulas de Nombramiento',
  },
  {
    // REPORTE DE BIENES POR DEPOSITARIA
    label: 'Bienes por Depositaría',
    link: 'reporte-bienes-depositarias',
    menu: 'Reporte de Bienes por Depositaría',
  },
  {
    // RELACIÓN DE AMPAROS
    label: 'Asignación de Bienes por Amparo',
    link: 'asignacion-bienes-amparo',
    menu: 'Relación de Amparos',
  },
  {
    // EMISIÓN DE ACUERDOS
    label: 'Emisión de Acuerdos',
    link: 'emision-acuerdos',
    menu: 'Emisión de Acuerdos',
  },
  {
    // NO SE IMPORTA EN EL MENU
    //HISTORICO SITUACION DEL BIEN
    label: 'Histórico Situación del Bien',
    link: 'historico-situacion-bien',
    menu: 'Histórico Situación del Bien',
  }, // NO SE IMPORTA EN EL MENU
  {
    // Resolución de Recursos de Revisión
    label: 'Resolución de Recursos de Revisión',
    link: 'relacion-recursos-revision',
    menu: 'Resolución de Recursos de Revisión',
  },
  {
    // Comprobación de Documentos para Recursos Revision
    label: 'Comprobación de Documentos para Recursos Revision',
    link: 'comprobacion-documentos-recursos-revision',
    menu: 'Comprobación de Doc. para Recursos Revision',
  },
  {
    // Reporte de Recursos de Revisión
    label: 'Reporte de Recursos de Revisión',
    link: 'reporte-recursos-revision',
    menu: 'Reporte de Recursos de Revisión',
  },
  {
    // Notificaciones por Expediente
    label: 'Notificaciones por Expediente',
    link: 'notificacion-expediente',
    menu: 'Notificaciones por Expediente',
  },
  {
    // Dictaminación Masiva Prog. Desalojo
    label: 'Dictaminación Masiva',
    link: 'dictaminacion-masiva-prog-desalojo',
    menu: 'Dictaminación Masiva Prog. Desalojo',
  },
  {
    // Dictaminación para devolución
    label: 'Dictaminación para devolución',
    link: 'return-ruling',
    menu: 'Dictaminación para devolución',
  },
  // DEPOSITARIA
];
export const MENU_OPTIONS_JURIDICAL_PROCESSES = [
  // PROCESOS JURIDICOS
  {
    label: 'Procesos Jurídicos',
    icon: 'bx-share-alt',
    subItems: [
      {
        // DICTAMINACIONES JURIDICAS
        label: routesJuridicalProcesses[0].menu,
        link: baseMenu + routesJuridicalProcesses[0].link + '/12345',
      },
      {
        // ACTUALIZACIÓN DE EXPEDIENTE
        label: routesJuridicalProcesses[1].menu,
        link: baseMenu + routesJuridicalProcesses[1].link + '/12345',
      },
      {
        // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
        label: routesJuridicalProcesses[2].menu,
        link: baseMenu + routesJuridicalProcesses[2].link,
      },
      {
        // DECLARATORIA Y OFICIOS DE ABANDONOS
        label: routesJuridicalProcesses[3].menu,
        link: baseMenu + routesJuridicalProcesses[3].link,
      },
      {
        label: 'Depositaría',
        subItems: [
          {
            // REGISTRO DE DEPOSITARIA
            label: routesJuridicalProcesses[4].menu,
            link:
              baseMenu + baseMenuDepositaria + routesJuridicalProcesses[4].link,
          },
          // Proceso de Dispersión de Pagos
          {
            // CONCILIACIÓN DE DISPERCIÓN DE PAGOS
            label: routesJuridicalProcesses[5].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              baseMenuProcesoDispercionPagos +
              routesJuridicalProcesses[5].link,
          },
          {
            // VALIDACIÓN DE PAGOS
            label: routesJuridicalProcesses[6].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              baseMenuProcesoDispercionPagos +
              routesJuridicalProcesses[6].link,
          },
          // Proceso de Dispersión de Pagos
          {
            // SOLICITUD/MONITOR DE DEPOSITARIA
            label: routesJuridicalProcesses[7].menu,
            link:
              baseMenu + baseMenuDepositaria + routesJuridicalProcesses[7].link,
          },
          {
            // REPORTE DE CÉDULAS DE NOMBRAMIENTO
            label: routesJuridicalProcesses[8].menu,
            link:
              baseMenu + baseMenuDepositaria + routesJuridicalProcesses[8].link,
          },
          {
            // REPORTE DE BIENES POR DEPOSITARIA
            label: routesJuridicalProcesses[9].menu,
            link:
              baseMenu + baseMenuDepositaria + routesJuridicalProcesses[9].link,
          },
          {
            // RELACIÓN DE AMPAROS
            label: routesJuridicalProcesses[10].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[10].link,
          },
          {
            // RELACIÓN DE AMPAROS
            label: routesJuridicalProcesses[11].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[11].link,
          },
          {
            // Resolución de Recursos de Revisión
            label: routesJuridicalProcesses[13].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[13].link,
          },
          {
            // Resolución de Recursos de Revisión
            label: routesJuridicalProcesses[14].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[14].link,
          },
          {
            // Reporte de Recursos de Revisión
            label: routesJuridicalProcesses[15].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[15].link,
          },
          {
            // Notificación por Expediente
            label: routesJuridicalProcesses[16].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[16].link,
          },
          {
            // Dictaminación Masiva Prog. Desalojo
            label: routesJuridicalProcesses[17].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[17].link,
          },
          {
            // Dictaminación para devolución
            label: routesJuridicalProcesses[18].menu,
            link:
              baseMenu +
              baseMenuDepositaria +
              routesJuridicalProcesses[18].link,
          },
        ],
      },
    ],
  },
  // PROCESOS JURIDICOS
];
