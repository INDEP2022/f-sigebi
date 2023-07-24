import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  FilterParams,
  ListParams,
} from './../../../../common/repository/interfaces/list-params';
import { COLUMNSTABL1 } from './columnsTable1';
import { COLUMNSTABLE2 } from './columnsTable2';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';

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
  assembleKeybool:boolean = true

  //Número de acta
  idProceeding:string = null

  //Boton de abrir actas
  labelButton: string = 'Cerrar Acta';

  //Formas
  actForm: FormGroup;

  //Data para select
  records = new DefaultSelect(['DES']);
  statusData = new DefaultSelect(['A','D','RT'])
  transferentData = new DefaultSelect()
  destructorData = new DefaultSelect()
  adminData = new DefaultSelect()

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
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams())
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1)
  navigateProceedings:boolean = false


  constructor(
    private fb: FormBuilder,
    private serviceUser: UsersService,
    private serviceRNomencla: ParametersService,
    private serviceExpedient: ExpedientService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private goodService: GoodService,
    private serviceDetailProc: DetailProceeDelRecService,
    private authService: AuthService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNSTABL1;
    this.settings2.columns = COLUMNSTABLE2;
  }

  ngOnInit(): void {
    this.initForm();
    this.initializesForm();
    this.buttonToggle();
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

  get universalFolio(){
    return this.actForm.get('universalFolio')
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
  inputsInCloseProceeding(){
    this.assembleKeybool = false
    this.elabDate.disable()
    this.destroyDate.disable()
    this.address.disable()
    this.observation.disable()
    this.responsible.disable()
    this.witness.disable()
    this.witness2.disable()
    this.destroMethod.disable()
    this.comptrollerWitness.disable()
  }

  //BUSQUEDA DE DATOS DE EXPEDIENTE
  searchDataByExp() {
    this.serviceExpedient.getById(this.expedient.value).subscribe(
      res => {
        this.prevAv.setValue(res.preliminaryInquiry);
        this.criminalCase.setValue(res.criminalCase);
        this.searchActData();
        this.searchGoodsByExp();
      },
      err => {
        console.log(err);
      }
    );
  }

  //BÚSQUEDA DE ACTAS POR EXPEDIENTE
  searchActData() {
    const paramsF = new FilterParams();
    paramsF.addFilter('typeProceedings', 'DESTRUCCION');
    paramsF.addFilter('numFile', this.expedient.value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res)
        this.idProceeding = JSON.parse(JSON.stringify(res['data'][0])).id
        this.totalItemsNavigate = res.count
        this.fillIncomeProceeding(res['data'][0]);
        this.searchGoodsInDetailProceeding();
        this.navigateProceedings = true
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
    this.statusProceeding.setValue(data.statusProceedings)
    this.universalFolio.setValue(data.universalFolio)
  }

  //BUSCAR BIENES DE EXPEDIENTE
  searchGoodsByExp(){
    const paramsF = new FilterParams()
    paramsF.addFilter('fileNumber',this.expedient.value)
    this.goodService.getAllFilterDetail(paramsF.getParams()).subscribe(
      res => {
        console.log(res)
        this.dataGoods.load(res.data)
        this.totalItems = res.count
      },
      err => {
        console.log(err)
      }
    )
  }

  //BUSCAR BIENES EN DETALLE_ACTA_ENT_RECEP
  searchGoodsInDetailProceeding(){
    this.serviceDetailProc.getGoodsByProceedings(this.idProceeding).subscribe(
      res => {
        console.log(res)
        this.dataGoodsAct.load(res.data)
        this.totalItems2 = res.count
      },
      err => {
        console.log(err)
      }
    )
  }
  
  //CAMBIAR BOTON SEGÚN ESTADO
  buttonToggle() {
    this.statusProceeding.valueChanges.subscribe(res => {
      if (['CERRADO', 'CERRADA'].includes(res)) {
        this.labelButton = 'Abrir Acta';
        this.inputsInCloseProceeding()
      } else {
        this.labelButton = 'Cerrar Acta';
      }
    });
  }
}
