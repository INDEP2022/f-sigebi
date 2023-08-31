export const REAL_STATE_COLUMNS = {
  numClasifGoods: {
    title: 'Clasificador',
    type: 'number',
    sort: false,
  },
  description: {
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
  UNIDAD_MEDIDA: {
    title: 'Unidad de Medida',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción Bien',
    type: 'string',
    sort: false,
  },
  CLASIF: {
    title: 'Clasificación',
    type: 'string',
    sort: false,
  },
  DESC_TIPO: {
    title: 'DESC_TIPO',
    type: 'string',
    sort: false,
  },
  DESC_STIPO: {
    title: 'DESC_STIPO',
    type: 'string',
    sort: false,
  },
  DESC_SSTIPO: {
    title: 'DESC_SSTIPO',
    type: 'string',
    sort: false,
  },
  DESC_SSSTIPO: {
    title: 'DESC_SSSTIPO',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'ESTATUS_BIEN',
    type: 'string',
    sort: false,
  },
  descriptionStatus: {
    title: 'DESCRIPCION_ESTATUS',
    type: 'string',
    sort: false,
  },
  DESTINO: {
    title: 'DESTINO',
    type: 'string',
    sort: false,
  },
  NO_TRASFERENTE: {
    title: 'NO_TRASFERENTE',
    type: 'string',
    sort: false,
  },
  DESCRIPCION_TRANSFERENTE: {
    title: 'DESCRIPCION_TRANSFERENTE',
    type: 'string',
    sort: false,
  },
  VOLANTE: {
    title: 'VOLANTE',
    type: 'string',
    sort: false,
  },
  expedientepreliminaryInquiry: {
    title: 'AV_PREVIA',
    type: 'string',
    sort: false,
  },
  expedientecriminalCase: {
    title: 'CAUSA_PENAL',
    type: 'string',
    sort: false,
  },
  CLAVE_OFICIO_DESAHOGO: {
    title: 'CLAVE_OFICIO_DESAHOGO',
    type: 'string',
    sort: false,
  },
  RESPUESTA_AUTORIDAD: {
    title: 'RESPUESTA_AUTORIDAD',
    type: 'string',
    sort: false,
  },
  FECHA_DESAHOGO: {
    title: 'FECHA_DESAHOGO',
    type: 'string',
    sort: false,
  },
  NO_ALMACEN: {
    title: 'NO_ALMACEN',
    type: 'string',
    sort: false,
  },
  DESCRIPCION_ALMACEN: {
    title: 'DESCRIPCION_ALMACEN',
    type: 'string',
    sort: false,
  },
  UBICACION_ALMACEN: {
    title: 'UBICACION_ALMACEN',
    type: 'string',
    sort: false,
  },
  CLAVE_DICTAMEN_PROCEDENCIA: {
    title: 'CLAVE_DICTAMEN_PROCEDENCIA',
    type: 'string',
    sort: false,
  },
  FECHA_DICTAMEN_PROCEDENCIA: {
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
    title: 'CLAVE_ACTA_RECEPCION',
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
    title: 'CLAVE_DESAHOGO',
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
  NUM_FOTOS: {
    title: 'NUM_FOTOS',
    type: 'string',
    sort: false,
  },
  OFICIOS: {
    title: 'OFICIOS',
    type: 'string',
    sort: false,
  },
  IMAGEN: {
    title: 'IMAGEN',
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
