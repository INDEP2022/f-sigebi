export const REAL_STATE_COLUMNS = {
  clasifGoodNumber: {
    title: 'Clasificador',
    type: 'number',
    sort: false,
  },
  sssubTypeDesc: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  /*seleccion: {
        title: 'Selección',
        type: 'custom',
        renderComponent: CheckboxSelectElementComponent, //CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((data: any) => {
                data.row.to = data.toggle;
            });
        },
        sort: false,
    },*/
};

export const REPORT_COLUMNS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  fileNumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  unitMeasure: {
    title: 'Unidad de Medida',
    type: 'string',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción Bien',
    type: 'string',
    sort: false,
  },
  goodClassNumber: {
    title: 'Clasificación',
    type: 'string',
    sort: false,
  },
  goodStatus: {
    title: 'Estatus Bien',
    type: 'string',
    sort: false,
  },
  statusDetails: {
    title: 'Descripción Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.descriptionStatus : '';
    },
  },
  destiny: {
    title: 'Destino',
    type: 'string',
    sort: false,
  },
  expediente: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null
        ? `${value.transferNumber} - ${value.expTransferNumber}`
        : '';
    },
  },
  /*DESCRIPCION_TRANSFERENTE: {
    title: 'Descripción Transferente',
    type: 'string',
    sort: false,
  },*/
  flyerNumber: {
    title: 'Volante',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  CLAVE_OFICIO_DESAHOGO: {
    title: 'Cve. Oficio Desahogo',
    type: 'string',
    sort: false,
  },
  RESPUESTA_AUTORIDAD: {
    title: 'Respuesta Autoridad',
    type: 'string',
    sort: false,
  },
  FECHA_DESAHOGO: {
    title: 'Fecha Desahogo',
    type: 'string',
    sort: false,
  },
  storeNumber: {
    title: 'No. Almacen',
    type: 'string',
    sort: false,
  },
  almacen: {
    title: 'Descripción Almacen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
  },
  ubication: {
    title: 'Ubicación Almacen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
  },
  origin: {
    title: 'Cve._DICTAMEN_PROCEDENCIA',
    type: 'string',
    sort: false,
  },
  proficientOpinion: {
    title: 'FECHA_DICTAMEN_PROCEDENCIA',
    type: 'string',
    sort: false,
  },
  FECHA_CAPTURA_ACTA_RECEPCION: {
    title: 'FECHA_CAPTURA_ACTA_RECEPCION',
    type: 'string',
    sort: false,
  },
  CLAVE_ACTA_RECEPCION: {
    title: 'Cve._ACTA_RECEPCION',
    type: 'string',
    sort: false,
  },
  COORD_ADMIN: {
    title: 'COORD_ADMIN',
    type: 'string',
    sort: false,
  },
  OFICIO_EXTERNO: {
    title: 'OFICIO_EXTERNO',
    type: 'string',
    sort: false,
  },
  CLAVE_DESAHOGO: {
    title: 'Cve._DESAHOGO',
    type: 'string',
    sort: false,
  },
  val1: {
    title: 'val1',
    type: 'string',
    sort: false,
  },
  val2: {
    title: 'val2',
    type: 'string',
    sort: false,
  },
  val3: {
    title: 'val3',
    type: 'string',
    sort: false,
  },
  val4: {
    title: 'val4',
    type: 'string',
    sort: false,
  },
  val5: {
    title: 'val5',
    type: 'string',
    sort: false,
  },
  val6: {
    title: 'val6',
    type: 'string',
    sort: false,
  },
  val7: {
    title: 'val7',
    type: 'string',
    sort: false,
  },
  val8: {
    title: 'val8',
    type: 'string',
    sort: false,
  },
  val9: {
    title: 'val9',
    type: 'string',
    sort: false,
  },
  val10: {
    title: 'val10',
    type: 'string',
    sort: false,
  },
  val11: {
    title: 'val11',
    type: 'string',
    sort: false,
  },
  val12: {
    title: 'val12',
    type: 'string',
    sort: false,
  },
  val13: {
    title: 'val13',
    type: 'string',
    sort: false,
  },
  val14: {
    title: 'val14',
    type: 'string',
    sort: false,
  },
  val15: {
    title: 'val15',
    type: 'string',
    sort: false,
  },
  val16: {
    title: 'val16',
    type: 'string',
    sort: false,
  },
  val17: {
    title: 'val17',
    type: 'string',
    sort: false,
  },
  val18: {
    title: 'val18',
    type: 'string',
    sort: false,
  },
  val19: {
    title: 'val19',
    type: 'string',
    sort: false,
  },
  val20: {
    title: 'val20',
    type: 'string',
    sort: false,
  },
};
