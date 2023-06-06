import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailDelegationsComponent } from '../../../shared-final-destination/detail-delegations/detail-delegations.component';
import { COLUMNS_ORDERS } from './columns-orders';
import {
  GenerateStrategyGoodsForm,
  GenerateStrategyServiceForm,
} from './utils/generate-strategy-forms';

interface IGenerateStrategyGlobal {
  goods: number;
  indicator: number;
  valuesIndicator: number;
  where: string;
}

interface IGenerateStrategyParams {
  proceedingNum: string | number;
  proceedingType: string;
}
@Component({
  selector: 'app-generate-estrategy',
  templateUrl: './generate-estrategy.component.html',
  styles: [],
})
export class GenerateEstrategyComponent extends BasePage implements OnInit {
  // PARAMETERS
  params: IGenerateStrategyParams = {
    proceedingNum: null, // NO_ACTA
    proceedingType: null, // TIPO_ACTAparams.
  };

  // GLOBAL
  global: IGenerateStrategyGlobal = {
    goods: null, // BIENES
    indicator: null, // INDICADOR
    valuesIndicator: null, // INDICA_VALORES
    where: null, // LV_WHERE
  };
  formService = this.fb.group(new GenerateStrategyServiceForm());
  formGoods = this.fb.group(new GenerateStrategyGoodsForm());
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
    private programmingGoodService: ProgrammingGoodsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    super();
    this.settingsOrders.columns = COLUMNS_ORDERS;
    this.activatedRoute.queryParams.subscribe(params => {
      this.params.proceedingNum = params['proceeding'] ?? null;
      this.params.proceedingType = params['type'] ?? null;
    });
    // proceeding
    // type;
  }

  ngOnInit(): void {
    const { proceedingNum } = this.params;
    if (proceedingNum) {
      this.global.goods = 0;
      this.global.indicator = 0;
      this.global.valuesIndicator = 1;
      this.global.where = null;
      this.initForm();
      this.fillData();
      this.fillGoods();
    } else if (this.global.where) {
      this.initForm();
    } else {
      this.global.where = null;
      this.initForm();
    }
  }

  //  PUP_INICIALIZA_FORMA
  initForm() {
    this.validateUser().subscribe();
    this.global.goods = 0;
    this.global.indicator = 0;

    if (this.global.where) {
      // SET_BLOCK_PROPERTY('ESTRATEGIA_FORMATO',DEFAULT_WHERE,:global.lv_where);
      // GO_BLOCK('ESTRATEGIA_FORMATO');
      // EXECUTE_QUERY;
    }
  }

  // PU_LLENA_DATOS
  fillData() {}

  // PU_LLENA_BIENES
  fillGoods() {}

  // PUP_VAL_USUARIO
  validateUser() {
    const authUser = this.getAuthUser();
    const params = new FilterParams();
    params.addFilter('id', authUser);
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      map(res => res.data[0]),
      tap(user => {
        if (!user) {
          return;
        }
        const tipUser = user.id.slice(0, 3);
        if (tipUser == 'TLP') {
          // TODO: DESABILITAR CAMPO DE ESTRATEGIA_FORMATO.ESTATUS
        }
      })
    );
  }

  getAuthUser() {
    return this.authService.decodeToken().preferred_username;
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
