import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map, tap } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailDelegationsComponent } from '../../../shared-final-destination/detail-delegations/detail-delegations.component';
import { COLUMNS_GOODS } from './columns-goods';
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
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    super();
    this.settingsGoods.columns = COLUMNS_GOODS;
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
