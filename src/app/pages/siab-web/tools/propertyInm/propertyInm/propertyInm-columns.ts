import { DatePipe } from '@angular/common';

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
  bien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  expediente: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  unidad_medida: {
    title: 'Unidad de Medida',
    type: 'string',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción Bien',
    type: 'string',
    sort: false,
  },
  clasif: {
    title: 'Clasificación',
    type: 'string',
    sort: false,
  },
  tipo_bien: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  s_tipo_bien: {
    title: 'SubTipo Bien',
    type: 'string',
    sort: false,
  },
  ss_tipo_bien: {
    title: 'SsuTipo Bien',
    type: 'string',
    sort: false,
  },
  sss_tipo_bien: {
    title: 'SssubTipo Bien',
    type: 'string',
    sort: false,
  },
  estatus_bien: {
    title: 'Estatus Bien',
    type: 'string',
    sort: false,
  },
  descripcion_estatus: {
    title: 'Descripción Estatus',
    type: 'string',
    sort: false,
  },
  destino: {
    title: 'Destino',
    type: 'string',
    sort: false,
  },
  no_trasferente: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  descripcion_transferente: {
    title: 'Descripción Transferente',
    type: 'string',
    sort: false,
  },
  volante: {
    title: 'Volante',
    type: 'string',
    sort: false,
  },
  av_previa: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  causa_penal: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },

  clave_oficio_desahogo: {
    title: 'Cve. Oficio Desahogo',
    type: 'string',
    sort: false,
  },
  respuesta: {
    title: 'Respuesta Autoridad',
    type: 'string',
    sort: false,
  },
  fecha_desahogo: {
    title: 'Fecha Desahogo',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  no_almacen: {
    title: 'No. Almacen',
    type: 'string',
    sort: false,
  },
  descripcion_almacen: {
    title: 'Descripción Almacen',
    type: 'string',
    sort: false,
  },
  ubicacion_almacen: {
    title: 'Ubicación Almacen',
    type: 'string',
    sort: false,
  },
  clave_dictamen_procedencia: {
    title: 'Cve. Dictamen Procedencia',
    type: 'string',
    sort: false,
  },
  fecha_dictamen_procedencia: {
    title: 'Fec. Dictamen Procedencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  fecha_captura_acta_recepcion: {
    title: 'Fec. Captura Acta Recepción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  clave_acta_recepcion: {
    title: 'Cve. Acta Recepción',
    type: 'string',
    sort: false,
  },
  coord_admin: {
    title: 'Coor Admin',
    type: 'string',
    sort: false,
  },
  oficio_externo: {
    title: 'Oficio Externo',
    type: 'string',
    sort: false,
  },
  clave_desahogo: {
    title: 'Cve. Desahogo',
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
  num_fotos: {
    title: 'No. Fotos',
    type: 'string',
    sort: false,
  },
  no_of_gestion: {
    title: 'No. Oficio Gestion',
    type: 'string',
    sort: false,
  },
};
