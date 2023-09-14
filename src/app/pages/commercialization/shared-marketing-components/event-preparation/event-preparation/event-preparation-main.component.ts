import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { BasePage } from 'src/app/core/shared';
import { TrackerValues } from 'src/app/pages/general-processes/goods-tracker/utils/constants/filter-match';
import { EventFormVisualProperties } from '../utils/classes/comer-event-properties';
import { IEventPreparationBlkProp } from '../utils/interfaces/event-preparation-block-property';
import { IEventPreparationParameters } from '../utils/interfaces/event-preparation-parameters';

export class EventPreparationMain extends BasePage {
  /**
   * BLK_TAREAS
   * @property {string} tDirection - T_DIRECCION
   */
  blkTasks = {
    tDirection: '',
  };
  /**
   * PARAMETERS.
   * @property {string} pValidTPEVEXUSU - PVALIDATPEVEXUSU.
   * @property {string} pBank - PBANCO.
   * @property {string} pRejected - PRECHAZADO.
   * @property {string} pDays - PDIAS.
   * @property {string} pValids - P_VALIDOS.
   * @property {string} pGoods - PASABIENES.
   * @property {string} pDirection - P_DIRECCION.
   */
  parameters: IEventPreparationParameters = {
    pValidTPEVEXUSU: null,
    pBank: null,
    pRejected: null,
    pDays: 0,
    pValids: 0,
    pGoods: null,
    pDirection: null,
  };

  /**
   * BLK_CTRL_PRINCIPAL
   * @property {boolean} chkProc - CHK_PROCEDENCIA, originalmente es S o N pasa a ser true o false
   * @property {boolean} chkLocation - CHK_UBICACION, originalmente es S o N pasa a ser true o false
   */
  blkCtrlMain = {
    chkProc: true,
    chkLocation: true,
  };

  /**
   * CANVAS
   * @property {boolean} main - CAN_PRINCIPAL
   */
  canvas = {
    main: true,
    events: true,
    stadistics: true,
  };

  blkProperties: IEventPreparationBlkProp = {
    eventBlk: {
      update: true,
    },
    lotComerBlk: {
      delete: true,
      update: true,
      insert: true,
    },
    goodsLotsBlk: {
      update: true,
      insert: true,
      delete: true,
    },
    comerAdjBlk: {
      update: TrackerValues,
    },
  };

  eventFormVisual = new EventFormVisualProperties();

  globalEvent: IComerEvent = null;
  loggedUser: TokenInfoModel = null;

  comerEventsListParams = new BehaviorSubject(new FilterParams());
  comerLotsListParams = new BehaviorSubject(new FilterParams());
  comerCustomersListParams = new BehaviorSubject(new FilterParams());
  lots = new LocalDataSource();
  events = new LocalDataSource();

  preparation = false;
  lotSelected: IComerLot;

  refreshFromPreparation = new Subject<void>();
}
