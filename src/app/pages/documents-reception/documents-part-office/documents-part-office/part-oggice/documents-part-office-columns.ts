import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const WORK_MAILBOX_COLUMNS = {
  columname: {
    title: 'Fecha',
    sort: false,
  },
  columname2: {
    title: 'Dias Hab. Nat',
    sort: false,
  },
  columname3: {
    title: 'Fecha Última Acción',
    sort: false,
  },
  columname4: {
    title: 'Estatus',
    sort: false,
  },
  columname5: {
    title: 'Trámite',
    sort: false,
  },
  columname6: {
    title: 'Usr Turnado',
    sort: false,
  },
  columname7: {
    title: 'Urgente Volante',
    sort: false,
  },
};

export const WORK_BIENES_COLUMNS = {
  goodNumber: {
    title: 'No. Bienes',
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
  parentGoodMenajeNumber: {
    title: 'No. bienes menaje',
    sort: false,
  },
  goodStatus: {
    title: 'Estatus',
    sort: false,
  },
};

export const WORK_ANTECEDENTES_COLUMNS = {
  proceedingsNum: {
    title: 'No. Antecedente',
    sort: false,
  },
  flierNum: {
    title: 'No. Volante',
    sort: false,
  },
  attended: {
    title: 'Aatendió',
    sort: false,
  },
  registryUsr: {
    title: 'USR registro',
    sort: false,
  },
  type: {
    title: 'Tipo',
    sort: false,
  },
  armedTradeKey: {
    title: 'Clave oficio',
    sort: false,
  },
};

export const DOCUMENT_PART_OFFCIE_COLUMNS2 = {
  processNumber: {
    title: 'No. Trámite',
    sort: false,
    editable: false,
  },
  issueSijNumber: {
    title: 'No. Asunto SIJ',
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
  officeNumber: {
    title: 'No. Oficio',
    sort: false,
    editable: false,
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
    title: 'Dias Hab. Nat',
    sort: false,
    editable: false,
  },
  processLastDate: {
    title: 'Fecha Última Actualización',
    sort: false,
    filter: false,
    editable: false,
  },
  observation: {
    title: 'Observaciones',
    sort: false,
    editable: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
    },
  },
  observationAdd: {
    title: 'Observaciones Add.',
    sort: false,
    editable: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
    },
  },
  priority: {
    title: 'Prioridad',
    sort: false,
    editable: false,
  },
  sheets: {
    title: 'Hojas',
    sort: false,
    editable: false,
  },
  notaryAutDate: {
    title: 'Fecha Aut. Notario',
    sort: false,
    filter: false,
    editable: false,
  },
  rebellionDate: {
    title: 'Fecha Rebelión',
    sort: false,
    filter: false,
    editable: false,
  },
  takePressureDate: {
    title: 'Fecha Toma Poseción',
    sort: false,
    filter: false,
    editable: false,
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
    }*/
  count: {
    title: 'Escaneado',
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
};
