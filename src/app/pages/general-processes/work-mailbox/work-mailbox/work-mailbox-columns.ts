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

export const WORK_MAILBOX_COLUMNS2 = {
  processNumber: {
    title: 'No. Trámite',
    sort: false,
  },
  issueSijNumber: {
    title: 'No. Asunto SIJ',
    sort: false,
  },
  processStatus: {
    title: 'Estatus',
    sort: false,
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
  },
  turnadoiUser: {
    title: 'Usr. Turnado',
    sort: false,
  },
  dailyConsecutiveNumber: {
    title: 'Consecutivo Diario',
    sort: false,
  },
  processEntryDate: {
    title: 'Fecha Ingreso Trámite',
    sort: false,
    filter: false,
  },
  flierNumber: {
    title: 'No. Volante',
    sort: false,
  },
  proceedingsNumber: {
    title: 'No. Expediente',
    sort: false,
  },
  issue: {
    title: 'Asunto',
    sort: false,
  },
  issueType: {
    title: 'Tipo de Asunto',
    sort: false,
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
  },
  descentfed: {
    title: 'Desc.Entidad Fed.',
    sort: false,
  },
  businessDays: {
    title: 'Días Hábiles',
    sort: false,
  },
  naturalDays: {
    title: 'Dias Hab. Nat',
    sort: false,
  },
  processLastDate: {
    title: 'Fecha Última Actualización',
    sort: false,
    filter: false,
  },
  observation: {
    title: 'Observaciones',
    sort: false,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
    },
  },
  observationAdd: {
    title: 'Observaciones Add.',
    sort: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
    },
  },
  priority: {
    title: 'Prioridad',
    sort: false,
  },
  sheets: {
    title: 'Hojas',
    sort: false,
  },
  notaryAutDate: {
    title: 'Fecha Aut. Notario',
    sort: false,
    filter: false,
  },
  rebellionDate: {
    title: 'Fecha Rebelión',
    sort: false,
    filter: false,
  },
  takePressureDate: {
    title: 'Fecha Toma Poseción',
    sort: false,
    filter: false,
  },
  areaATurn: {
    title: 'Área a Turnar',
    sort: false,
  },
  userATurn: {
    title: 'Usr. a Turnar',
    sort: false,
  },
  folioRep: {
    title: 'Folio Rep.',
    sort: false,
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
  }
  count: {
    title: 'Count',
    sort: false,
  },*/
};
