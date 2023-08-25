import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
import { COLUMNSTABL1 } from './columnsTable1';
import { COLUMNSTABLE2 } from './columnsTable2';

@Component({
  selector: 'app-destruction-acts',
  templateUrl: './destruction-acts.component.html',
  styles: [],
})
export class DestructionActsComponent extends BasePage implements OnInit {
  formTable1: FormGroup;
  formTable2: FormGroup;
  response: boolean = false; //data backend
  settings2: any;
  data = new LocalDataSource();
  data2 = new LocalDataSource();
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  //Opción de armar clave
  assembleKeybool: boolean = true;

  //Número de acta
  idProceeding: string = null;

  //Boton de abrir actas
  labelButton: string = 'Cerrar Acta';

  //Formas
  actForm: FormGroup;

  //Data para select
  records = new DefaultSelect(['DES']);
  statusData = new DefaultSelect(['A', 'D', 'RT']);
  transferentData = new DefaultSelect();
  destructorData = new DefaultSelect();
  adminData = new DefaultSelect();

  //Data para llenar tablas
  dataGoods = new LocalDataSource();
  dataGoodsAct = new LocalDataSource();

  //NAVEGACION DE TABLA DE BIENES
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  limit = new FormControl(10);

  //NAVEGACION DE TABLA DE BIENES EN ACTA
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  limit2 = new FormControl(10);

  //DATOS DE USUARIO
  delUser: string;
  subDelUser: string;
  departmentUser: string;

  //Variables globales
  GSt_todo: string;
  GSt_rec_adm: string;

  //NAVEGACIÓN DE ACTAS
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1);
  navigateProceedings: boolean = false;
  qParams = {
    origin: '',
    expedient: '',
    type: '',
  };

  //DATOS DEL EXPEDIENTE
  expType: string;
  noTransfer: string | number;

  edoPhase: string | number;

  constructor(
    private fb: FormBuilder,
    private serviceUser: UsersService,
    private serviceRNomencla: ParametersService,
    private serviceExpedient: ExpedientService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private goodService: GoodService,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceTransferent: TransferenteService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();

    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNSTABL1;
    this.settings2.columns = COLUMNSTABLE2;
  }

  goBack() {
    //FCONGENRASTREADOR
    if (this.qParams.origin == 'FCONGENRASTREADOR') {
      this.router.navigate([`/pages/general-processes/goods-tracker`]);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.initializesForm();
    this.buttonToggle();
    this.getEdoPhase();

    this.newProceeding();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.qParams.origin = params['origin'];
        this.qParams.expedient = params['NO_EXPEDIENTE_F'];
        this.qParams.type = params['TIPO_DICTA_F'];
        this.actForm.get('expedient').setValue(this.qParams.expedient);
        this.searchDataExp();
      });
  }

  initializesForm() {
    const token = this.authService.decodeToken();
    console.log(token);
    const routeUser = `?filter.id=$eq:${token.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(
      res => {
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        this.delUser = resJson.usuario.delegationNumber;
        this.subDelUser = resJson.usuario.subdelegationNumber;
        this.departmentUser = resJson.usuario.departamentNumber;
        if (this.delUser == '0') {
          this.GSt_todo = 'TODO';
        } else {
          this.GSt_todo = 'NADA';
        }
        const paramsF = new FilterParams();
        paramsF.addFilter('numberDelegation2', this.delUser);
        this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            this.GSt_rec_adm = 'FILTRAR';
          },
          err => {
            this.alert(
              'error',
              'Area no asignada al usuario. Revisar la tabla SEG_USUARIOS',
              ''
            );
            this.GSt_rec_adm = 'NADA';
          }
        );
      },
      err => {}
    );
  }

  //TODO: FALTA HACER LA VALIDACIONES SI VIENE DE RASTREADOR

  //GETS

  get expedient() {
    return this.actForm.get('expedient');
  }

  get prevAv() {
    return this.actForm.get('prevAv');
  }

  get criminalCase() {
    return this.actForm.get('criminalCase');
  }

  get statusProceeding() {
    return this.actForm.get('statusProceeding');
  }

  get act2() {
    return this.actForm.get('act2');
  }

  get elabDate() {
    return this.actForm.get('elabDate');
  }

  get destroyDate() {
    return this.actForm.get('destroyDate');
  }

  get address() {
    return this.actForm.get('address');
  }

  get observation() {
    return this.actForm.get('observation');
  }

  get responsible() {
    return this.actForm.get('responsible');
  }

  get witness() {
    return this.actForm.get('witness');
  }

  get witness2() {
    return this.actForm.get('witness2');
  }

  get destroMethod() {
    return this.actForm.get('destroyMethod');
  }

  get comptrollerWitness() {
    return this.actForm.get('comptrollerWitness');
  }

  get universalFolio() {
    return this.actForm.get('universalFolio');
  }

  //Gets para armar la nueva clave de acta
  get act() {
    return this.actForm.get('act');
  }

  get status() {
    return this.actForm.get('status');
  }

  get transferent() {
    return this.actForm.get('transferent');
  }

  get destructor() {
    return this.actForm.get('destructor');
  }

  get admin() {
    return this.actForm.get('admin');
  }

  get folio() {
    return this.actForm.get('folio');
  }

  get year() {
    return this.actForm.get('year');
  }

  get month() {
    return this.actForm.get('month');
  }

  initForm() {
    this.actForm = this.fb.group({
      expedient: [null],
      prevAv: [null],
      criminalCase: [null],
      //Construcción de acta
      act: [null],
      status: [null],
      transferent: [null],
      destructor: [null],
      admin: [null],
      folio: [null],
      year: [null],
      month: [null],
      //Datos de acta
      act2: [null],
      statusProceeding: [null],
      elabDate: [null],
      destroyDate: [null],
      address: [null],
      observation: [null],
      responsible: [null],
      witness: [null],
      witness2: [null],
      destroyMethod: [null],
      comptrollerWitness: [null],
      //Folio universal
      universalFolio: [null],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });
  }

  searchDataExp() {
    this.searchDataByExp();
  }
  //DESACTIVAR CAMPOS CUANDO EL ACTA ESTA CERRADAS
  inputsInCloseProceeding() {
    /* this.assembleKeybool = false */
    this.elabDate.disable();
    this.destroyDate.disable();
    this.address.disable();
    this.observation.disable();
    this.responsible.disable();
    this.witness.disable();
    this.witness2.disable();
    this.destroMethod.disable();
    this.comptrollerWitness.disable();
  }

  //BUSQUEDA DE DATOS DE EXPEDIENTE
  searchDataByExp() {
    this.serviceExpedient.getById(this.expedient.value).subscribe(
      res => {
        console.log(res);
        this.prevAv.setValue(res.preliminaryInquiry);
        this.criminalCase.setValue(res.criminalCase);
        this.expType = res.expedientType;
        this.noTransfer = res.transferNumber;

        this.searchActData();
        this.searchGoodsByExp();
      },
      err => {
        console.log(err);
      }
    );
  }

  //ETAPA EDO()
  getEdoPhase() {
    this.serviceRNomencla
      .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
      .subscribe(res => {
        this.edoPhase = JSON.parse(JSON.stringify(res)).stagecreated;
      });
  }

  //BÚSQUEDA DE ACTAS POR EXPEDIENTE
  searchActData() {
    const paramsF = new FilterParams();
    paramsF.addFilter('typeProceedings', 'DESTRUCCION');
    paramsF.addFilter('numFile', this.expedient.value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.idProceeding = JSON.parse(JSON.stringify(res['data'][0])).id;
        this.totalItemsNavigate = res.count;
        this.fillIncomeProceeding(res['data'][0]);
        this.searchGoodsInDetailProceeding();
        this.navigateProceedings = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  //FUNCIÓN PARA OBTENER LA FECHA CORRECTA
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  //LLENAR VALORES SI EXISTE ACTAS
  fillIncomeProceeding(data: any) {
    this.act2.setValue(data.keysProceedings);
    this.elabDate.setValue(this.correctDate(data.elaborationDate));
    this.destroyDate.setValue(this.correctDate(data.datePhysicalReception));
    this.address.setValue(data.address);
    this.observation.setValue(data.observations);
    this.responsible.setValue(data.responsible);
    this.witness.setValue(data.witness1);
    this.witness2.setValue(data.witness2);
    this.destroMethod.setValue(data.destructionMethod);
    this.comptrollerWitness.setValue(data.comptrollerWitness);
    this.statusProceeding.setValue(data.statusProceedings);
    this.universalFolio.setValue(data.universalFolio);
  }

  //BUSCAR BIENES DE EXPEDIENTE
  searchGoodsByExp() {
    const paramsF = new FilterParams();
    paramsF.addFilter('fileNumber', this.expedient.value);
    this.goodService.getAllFilterDetail(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.dataGoods.load(res.data);
        this.totalItems = res.count;
      },
      err => {
        console.log(err);
      }
    );
  }

  //BUSCAR BIENES EN DETALLE_ACTA_ENT_RECEP
  searchGoodsInDetailProceeding() {
    this.serviceDetailProc.getGoodsByProceedings(this.idProceeding).subscribe(
      res => {
        console.log(res);
        this.dataGoodsAct.load(res.data);
        this.totalItems2 = res.count;
      },
      err => {
        console.log(err);
      }
    );
  }

  //CAMBIAR BOTON SEGÚN ESTADO
  buttonToggle() {
    this.statusProceeding.valueChanges.subscribe(res => {
      if (['CERRADO', 'CERRADA'].includes(res)) {
        this.labelButton = 'Abrir Acta';
        this.inputsInCloseProceeding();
      } else {
        this.labelButton = 'Cerrar Acta';
      }
    });
  }

  //TRAER TRANSFERENTES
  getTransfers(params: any) {
    const model = {
      transfereeNumber: this.noTransfer,
      expedientType: this.expType,
    };
    const filterParams = `?filter.password=${params.text}`;
    this.serviceTransferent.appsGetPassword(model, filterParams).subscribe(
      res => {
        console.log(res);
        this.transferentData = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  //TRAER DELEGACION QUE DESTRUYE
  getAdminDestroy(params: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('stageedo', this.edoPhase);
    paramsF.addFilter('delegation', params.text, SearchFilter.ILIKE);
    this.serviceRNomencla.getRNomencla(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.destructorData = new DefaultSelect(res.data);
      },
      err => {
        console.log(err);
      }
    );
  }

  //FUNCION DE AGREGAR CEROS AL FOLIO
  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  //TRAER DELEGACION QUE ADMINISTRA

  //FUNCION PARA ARMAR LA CLAVE
  weaponCveProceedingFn() {
    this.act.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.status.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.transferent.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.destructor.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.admin.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.folio.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
    this.year.valueChanges.subscribe(res => {
      this.weaponCveProceeding();
    });
  }

  //ARMA CLAVE DE NUEVA ACTA
  weaponCveProceeding() {
    const nameAct =
      (this.act.value != null ? this.act.value : '') +
      '/' +
      (this.status.value != null ? this.status.value : '') +
      '/' +
      (this.transferent.value != null ? this.transferent.value.password : '') +
      '/' +
      (this.destructor.value != null ? this.destructor.value.delegation : '') +
      '/' +
      (this.admin.value != null ? this.admin.value : '') +
      '/' +
      (this.folio.value != null ? this.zeroAdd(this.folio.value, 5) : '') +
      '/' +
      (this.year.value != null ? this.zeroAdd(this.year.value, 2) : '') +
      '/' +
      (this.month.value != null ? this.zeroAdd(this.month.value, 2) : '');

    this.act2.setValue(nameAct);
  }

  //FUNCIÓN NUEVA ACTA
  newProceeding() {
    this.year.disable();
    this.month.disable();
    this.year.setValue(format(new Date(), 'yy'));
    this.month.setValue(format(new Date(), 'MM'));
    this.weaponCveProceedingFn();
  }

  unsubscribeFn() {}
}
