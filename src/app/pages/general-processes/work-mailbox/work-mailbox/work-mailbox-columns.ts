import { DatePipe } from '@angular/common';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const WORK_BIENES_COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción',
    sort: false,
  },
  //TODO:VALIDATE ENTITY
  parentGoodMenajeNumber: {
    title: 'No. Bien Padre Menaje',
    sort: false,
  },
  goodStatus: {
    title: 'Estatus',
    sort: false,
  },
};

export const WORK_ANTECEDENTES_COLUMNS = {
  proceedingsNum: {
    title: 'No. Expediente',
    sort: false,
  },
  flierNum: {
    title: 'No. Volante',
    sort: false,
  },
  attended: {
    title: 'Atendió',
    sort: false,
  },
  type: {
    title: 'Dictamen o Des.',
    sort: false,
  },
  registryUsr: {
    title: 'Tipo',
    sort: false,
  },
  armedTradeKey: {
    title: 'Clave Dic. u Oficio',
    sort: false,
  },
};

export const WORK_MAILBOX_COLUMNS2 = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.turnSelect = data.toggle;
      });
    },
  },
  processNumber: {
    title: 'No. Trámite',
    sort: false,
    editable: false,
  },
  officeNumber: {
    title: 'No. Oficio',
    sort: false,
    editable: false,
  },
  flierNumber: {
    title: 'No. Volante',
    sort: false,
    editable: false,
  },
  proceedingsNumber: {
    title: 'No. Expediente',
    sort: false,
    editable: false,
  },
  processStatus: {
    title: 'Estatus',
    sort: false,
    editor: {
      type: 'list',
      config: {
        selectText: 'Estatus',
        list: [
          { value: 'ABI', title: 'ABI' },
          { value: 'ADI', title: 'ADI' },
          { value: 'AMI', title: 'AMI' },
          { value: 'AMP', title: 'AMP' },
          { value: 'CNI', title: 'CNI' },
          { value: 'DCI', title: 'DCI' },
          { value: 'DJI', title: 'DJI' },
          { value: 'DJP', title: 'DJP' },
          { value: 'DJS', title: 'DJS' },
          { value: 'DNI', title: 'DNI' },
          { value: 'DPI', title: 'DPI' },
          { value: 'DSI', title: 'DSI' },
          { value: 'DTI', title: 'DTI' },
          { value: 'DVI', title: 'DVI' },
          { value: 'FNI', title: 'FNI' },
          { value: 'OIP', title: 'OIP' },
          { value: 'OPI', title: 'OPI' },
          { value: 'OPP', title: 'OPP' },
          { value: 'OPS', title: 'OPS' },
          { value: 'RFI', title: 'RFI' },
          { value: 'RFP', title: 'RFP' },
          { value: 'RFS', title: 'RFS' },
          { value: 'RSI', title: 'RSI' },
        ],
      },
    },
    /*filterFunction(cell?: any, search?: string): boolean {
      let column = cell.processStatus;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },*/
  },
  processSituation: {
    title: 'Situación Trámite',
    sort: false,
    editable: false,
  },
  turnadoiUser: {
    title: 'Usr. Turnado',
    sort: false,
    editable: false,
  },
  dailyConsecutiveNumber: {
    title: 'Consecutivo Diario',
    sort: false,
    editable: false,
  },
  processEntryDate: {
    title: 'Fecha Ingreso Trámite',
    sort: false,
    filter: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  issue: {
    title: 'Asunto',
    sort: false,
    editable: false,
  },
  issueType: {
    title: 'Tipo de Asunto',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case '1':
            value = 'Acta Circunstanciada';
            return value;
            break;
          case '2':
            value = 'Amparo';
            return value;
            break;
          case '3':
            value = 'Averiguación Previa';
            return value;
            break;
          case '4':
            value = 'Causa Penal';
            return value;
            break;
          case '5':
            value = 'Expediente Transferente';
            return value;
            break;
          default:
            value = 'S/N';
            return value;
            break;
        }
      }
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Tipo de Asunto',
        list: [
          { value: 1, title: 'Acta Circunstanciada' },
          { value: 2, title: 'Amparo' },
          { value: 3, title: 'Averiguación Previa' },
          { value: 4, title: 'Causa Penal' },
          { value: 5, title: 'Expediente Transferente' },
        ],
      },
    },
  },
  descentfed: {
    title: 'Desc.Entidad Fed.',
    sort: false,
    editable: false,
  },
  businessDays: {
    title: 'Días Hábiles',
    sort: false,
    editable: false,
  },
  naturalDays: {
    title: 'Días Hab. Nat',
    sort: false,
    editable: false,
  },
  processLastDate: {
    title: 'Fecha Última Actualización',
    sort: false,
    filter: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  observation: {
    title: 'Observaciones',
    type: 'custom',
    sort: false,
    editable: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  /*observationAdd: {
    title: 'Observaciones Add.',
    type: 'custom',
    sort: false,
    editable: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => value ?? '',
  },*/
  priority: {
    title: 'Prioridad',
    sort: false,
    editable: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
    editable: false,
  },
  notaryAutDate: {
    title: 'Fecha Aut. Notario',
    sort: false,
    filter: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  rebellionDate: {
    title: 'Fecha Rebelión',
    sort: false,
    filter: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  takePressureDate: {
    title: 'Fecha Toma Poseción',
    sort: false,
    filter: false,
    editable: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  areaATurn: {
    title: 'Área a Turnar',
    sort: false,
    editable: false,
  },
  userATurn: {
    title: 'Usr. a Turnar',
    sort: false,
    editable: false,
  },
  folioRep: {
    title: 'Folio Rep.',
    sort: false,
    editable: false,
  },
  count: {
    title: 'Digitalizado',
    sort: false,
    editable: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        switch (value) {
          case '0':
            value = 'Sin Escanear';
            return value;
            break;
          case '1':
            value = 'Escaneado';
            return value;
            break;
          default:
            value = 'Sin Referencia';
            return value;
            break;
        }
      }
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Digitalizados',
        list: [
          { value: 0, title: 'Pendientes' },
          { value: 1, title: 'Escaneados' },
        ],
      },
    },
  },

  /*royalProceesDate: {
    title: 'Fecha Real Trámite',
    sort: false,
  },*/
  /*clasifDict: {
    title: 'Clasf. Dictámen',
    sort: false,
  },
  registerUser: {
    title: 'Usr. Registro',
    sort: false,
  },
  issueSijNumber: {
    title: 'No. Asunto SIJ',
    sort: false,
    editable: false,
  },*/
};

export const array_column_table = (objColumnsTable: any) => {
  let response = [];
  for (const key in objColumnsTable) {
    if (Object.prototype.hasOwnProperty.call(objColumnsTable, key)) {
      const element = objColumnsTable[key];
      if (element) {
        element['key'] = key;
        response.push(element);
      }
    }
  }
  return response;
};
