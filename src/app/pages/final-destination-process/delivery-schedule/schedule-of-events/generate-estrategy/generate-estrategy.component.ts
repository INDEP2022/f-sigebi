import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DetailDelegationsComponent } from '../../../shared-final-destination/detail-delegations/detail-delegations.component';
import { COLUMNS_GOODS } from './columns-goods';
import { COLUMNS_ORDERS } from './columns-orders';

@Component({
  selector: 'app-generate-estrategy',
  templateUrl: './generate-estrategy.component.html',
  styles: [],
})
export class GenerateEstrategyComponent extends BasePage implements OnInit {
  formService: FormGroup;
  formGoods: FormGroup;
  bsModalRef?: BsModalRef;
  myTime: Date = new Date();
  settingsGoods = { ...this.settings, actions: false };
  settingsOrders = { ...this.settings, actions: false };
  dataGoods = EXAMPLE_DATA1;
  dataOrders = EXAMPLE_DATA2;
  globals = {
    indicators: 0,
    goods: 0,
  };
  strategyFomat = {
    programType: 'R',
    virDelegations: '',
    numberTranserent: 0,
    issuingNumber: 0,
    numberAuthority: 0,
  };
  blkParam = {
    ProgType: 0,
    selMassiPro: 0,
  };
  authUser: string = null;
  authUserName: string = null;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingGoodService: ProgrammingGoodsService
  ) {
    super();
    this.settingsGoods.columns = COLUMNS_GOODS;
    this.settingsOrders.columns = COLUMNS_ORDERS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formService = this.fb.group({
      type: [null, []],
      process: [null, []],
      processDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      captureDate: [null, []],
      regionalCoord: [null, [Validators.pattern(STRING_PATTERN)]],
      coordinationDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      serviceKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      cancellAuthDate: [null, []],
      uniqueKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      transferenceId: [null, []],
      transferenceDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      transmitterId: [null, []],
      transmitterDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      authorityId: [null, []],
      authorityDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      keyStore: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      storeDescrip: [null, [Validators.pattern(STRING_PATTERN)]],
      ubication: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formGoods = this.fb.group({
      eventStartDate: [null, []],
      eventEndDate: [null, []],
      eventTime: [new Date(), []],
      statusChange: [null, []],
    });
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Histórico de Estatus',
        optionColumn: 'status-history',
      },
    };
    this.bsModalRef = this.modalService.show(
      DetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  settingsChange($event: any): void {
    this.settingsOrders = $event;
  }

  onSubmit() {}

  onSubmit2() {}

  /////////////////////////// ALEXANDER //////////////////////
  async incorporatesGoods() {
    console.log('Entre aca');

    const lv_TIPO_PROGRAMACION: any = '';
    //const T_VALPRO = await this.getTypeProgramin();
    await this.PUP_TIPO_PROGRAMACION();
    const typeProg: any = 'D';
    if (typeProg === 'D' || typeProg === 'R') {
      await this.PU_GEN_BIENES();
    } else {
      //TODO: Hacer esto cuando esten los bloques de programas
      ////:BLK_PARAM.TIPO_PROGRA := 0;
      this.blkParam.ProgType = 0;
    }
  }
  getTypeProgramin() {
    return new Promise((res, rej) => {});
  }
  async PUP_TIPO_PROGRAMACION() {}

  async PU_GEN_BIENES() {
    let lv_TOTBIE: number;
    let lv_TIPOPR: string;
    let lv_TIPO_PROGRAMACION: string;
    let lv_PROCESO: number;

    this.globals.indicators = 0;
    /// SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
    if (this.strategyFomat.programType === 'R') {
      lv_PROCESO = 1;
      lv_TIPOPR = 'recepción';
    } else if (this.strategyFomat.programType === 'D') {
      lv_PROCESO = 3;
      lv_TIPOPR = 'donaciones';
    } else {
      switch (this.blkParam.ProgType) {
        case 2:
          lv_PROCESO = 2;
          lv_TIPOPR = 'entrgra-comercialización';
          break;
        case 3:
          lv_PROCESO = 3;
          lv_TIPOPR = 'entrgra-donaciones';
          break;
        case 4:
          lv_PROCESO = 4;
          lv_TIPOPR = 'entrgra-destrucción';
          break;
        case 5:
          lv_PROCESO = 5;
          lv_TIPOPR = 'entrgra-devolución';
          break;
        default:
          break;
      }
    }

    if (this.formService.get('transferenceId').value === null) {
      this.onLoadToast(
        'info',
        'Para realizar la búsqueda de programaciones es necesaria la transferente '
      );
    } else {
      if (this.strategyFomat.programType === 'R') {
        const response = await this.alertQuestion(
          'info',
          '¿ Bienes con programación ?',
          '¿Los bienes a incorporar cuentan con una programación previa? '
        );
        if (response.isConfirmed) {
          this.globals.goods = 0;
          this.PA_EST_BIENES_PROG_TRANS(
            lv_PROCESO,
            this.strategyFomat.virDelegations,
            this.strategyFomat.numberTranserent,
            this.strategyFomat.issuingNumber,
            this.strategyFomat.numberAuthority
          );
        } else {
          this.globals.goods = 1;
          this.PA_EST_PROG_TRANS_BIE(
            lv_PROCESO,
            this.strategyFomat.virDelegations,
            this.strategyFomat.numberTranserent,
            this.strategyFomat.issuingNumber,
            this.strategyFomat.numberAuthority
          );
        }
      } else {
        this.PA_EST_BIENES_PROG_TRANS(
          lv_PROCESO,
          this.strategyFomat.virDelegations,
          this.strategyFomat.numberTranserent,
          this.strategyFomat.issuingNumber,
          this.strategyFomat.numberAuthority
        );
      }
    }

    lv_TOTBIE = await this.getCTotbie();

    if (lv_TOTBIE === 0) {
      this.onLoadToast(
        'info',
        'No hay bienes programados para ' +
          lv_TIPOPR +
          ' en esta Cordinación Regional en este mes'
      );
    } else {
      if (this.globals.goods === 1) {
        /* SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
        GO_BLOCK('TMP_EST_BIENES_PROG');
        EXECUTE_QUERY(); */
        this.blkParam.selMassiPro = 0;
      } else {
        /* SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
        GO_BLOCK('TMP_EST_PROGRAMACIONES');
        EXECUTE_QUERY();
        GO_BLOCK('TMP_EST_BIENES_PROG');
        EXECUTE_QUERY(); */
        this.blkParam.selMassiPro = 0;
      }
    }
  }

  PA_EST_BIENES_PROG_TRANS(
    lv_PROCESO: string | number,
    VIR_DELEGACION: string,
    NO_TRANSFERENTE: number | string,
    NO_EMISORA: number | string,
    NO_AUTORIDAD: number | string
  ) {}

  PA_EST_PROG_TRANS_BIE(
    lv_PROCESO: string | number,
    VIR_DELEGACION: string,
    NO_TRANSFERENTE: number | string,
    NO_EMISORA: number | string,
    NO_AUTORIDAD: number | string
  ) {}
  getCTotbie() {
    const params: ListParams = {};
    params['filter.itsTUser'] = `$eq:sigebiAbmon`; ///${this.authUserName}
    return new Promise<number>((res, _rej) => {
      this.programmingGoodService.tmpEstGoodsProgr(params).subscribe({
        next: response => {
          res(response.count);
        },
        error: _err => {
          res(0);
        },
      });
    });
  }
  ////////////////////////// FIN ALEXANDER ///////////////////
}

const EXAMPLE_DATA1 = [
  {
    numberGood: 12121,
    description: 'Muebles',
    quantity: 15,
    volumetry: 'volumen',
  },
];

const EXAMPLE_DATA2 = [
  {
    idService: 1,
    serviceDescription: 'posicion de alr..',
    idSpecification: 15,
    specification: 'Almacén techado',
    idTurn: 21,
    turn: 'Posición Piso',
    idVariableCost: 9,
    variableCost: 'Cuota Mensual',
    observations: '',
    cost: '',
    quantity: '',
    amount: '',
  },
];
