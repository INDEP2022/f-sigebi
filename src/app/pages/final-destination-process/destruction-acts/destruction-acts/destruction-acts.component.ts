import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  IBlkBie,
  IQueryRegAdmin,
} from 'src/app/core/interfaces/list-response.interface';
import { IPAAbrirActasPrograma } from 'src/app/core/models/good-programming/good-programming';
import {
  IDeleteDetailProceeding,
  IDetailProceedingsDeliveryReception,
} from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IPufValidTerm,
  IPupMovDestruction,
  IQueryRegAdminGood,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PackageComponent } from '../package/package.componet';
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
  assembleKeybool: boolean = false;

  //Número de acta
  idProceeding: string = null;

  //Boton de abrir actas
  labelButton: string = 'Cerrar Acta';

  //Formas
  actForm: FormGroup;
  optionRB: FormGroup;

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
  isNewProceeding = true;
  loadingProcedure = false;
  loadingTable = false;
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

  //DATOS TEMPORALES
  selectGood: any = null;
  selectGoodAct: any = null;
  proccedingId: any = null;

  //PARA MOSTRAR
  di_status_good: any = null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private documentService: DocumentsService,
    private goodService: GoodService,
    private modalService: BsModalService,
    private router: Router,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceExpedient: ExpedientService,
    private serviceProceeding: ProceedingsService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceProgrammingGood: ProgrammingGoodService,
    private serviceRNomencla: ParametersService,
    private serviceTransferent: TransferenteService,
    private serviceUser: UsersService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      rowClassFunction: (row: { data: { avalaible: any } }) =>
        row.data.avalaible ? 'bg-success text-white' : 'bg-dark text-white',
    };
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
    console.log(this.loadingProcedure);
    this.initForm();
    this.initializesForm();
    this.buttonToggle();
    this.getEdoPhase();

    this.newProceeding();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log('Llama');
        this.qParams.origin = params['origin'];
        this.qParams.expedient = params['NO_EXPEDIENTE_F'];
        this.qParams.type = params['TIPO_DICTA_F'];
        this.actForm.get('expedient').setValue(this.qParams.expedient);
        this.searchDataExp();
      });

    this.navigateProceeding();
  }

  initializesForm() {
    const token = this.authService.decodeToken();
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

    this.optionRB.get('option').valueChanges.subscribe(res => {
      console.log(res);
      if (res == 'P') {
        this.openModalPack();
      }
    });
  }

  //MODAL PAQUETE
  openModalPack() {
    let modalConfig = MODAL_CONFIG;
    modalConfig.class = 'modal-lg';
    modalConfig.initialState = {
      no_acta: this.idProceeding,
      callback: (data: any) => {
        console.log(data);
        console.log(data.expedient);
        if (data.insertedRecords > 0) {
          this.alert('success', 'Proceso terminado', '');
          this.expedient.setValue(data.expedient);
          this.searchDataExp();
        } else {
          this.alert('warning', 'No se insertaron bienes en el proceso', '');
        }
      },
    };
    this.modalService.show(PackageComponent, modalConfig);
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
    this.optionRB = this.fb.group({
      option: ['N'],
    });

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
    this.loadingProcedure = true;
    this.loadingTable = true;
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
        this.loadingProcedure = false;
        this.loadingTable = false;
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
        this.isNewProceeding = false;
        this.assembleKeybool = false;
        this.loadingProcedure = false;
      },
      err => {
        this.isNewProceeding = true;
        this.assembleKeybool = true;
        this.loadingProcedure = false;
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
    this.proccedingId = data.id;
  }

  //VALIDAR BIENES
  validatedGood(e: any) {
    const body: IBlkBie = {
      status: e.status,
      proceedingsNumber: this.actForm.get('expedient').value,
      goodNumber: e.goodId,
      screen: 'FACTDESACTASDESTR',
    };

    return new Promise((resolve, reject) => {
      this.serviceProcVal.blkBie(body).subscribe(
        res => {
          console.log(res);
          resolve({
            avalaible: res.available == 'N' ? false : true,
            bamparo: res.bamparo,
            status: res.statusGood,
            minute: res.Minutes,
            di_status: res.diDescriptionGood,
          });
        },
        err => {
          resolve({
            avalaible: false,
            bamparo: null,
            status: '',
          });
        }
      );
    });
  }

  //BUSCAR BIENES DE EXPEDIENTE
  searchGoodsByExp() {
    const paramsF = new FilterParams();
    paramsF.addFilter('fileNumber', this.expedient.value);
    this.goodService.getAllFilterDetail(paramsF.getParams()).subscribe(
      async res => {
        const newData = await Promise.all(
          res.data.map(async (e: any) => {
            const resp = await this.validatedGood(e);
            const jsonResp = JSON.parse(JSON.stringify(resp));
            console.log(jsonResp);
            return {
              ...e,
              avalaible: jsonResp.avalaible,
              acta: jsonResp.minute,
              diStatus: jsonResp.di_status,
            };
          })
        );

        console.log(newData);
        this.dataGoods.load(newData);
        this.totalItems = res.count;
        this.loadingTable = false;
      },
      err => {
        this.loadingTable = false;
        this.dataGoods.load([]);
        this.alert('warning', 'No se encontraron bienes', '');
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
        this.dataGoodsAct.load([]);
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

  //TRAER DELEGACION QUE ADMINISTRA
  getAdmin(params?: any) {
    const token = this.authService.decodeToken();
    const body: IQueryRegAdmin = {
      allGst: token.department == '0' ? 'TODO' : 'NADA',
      delegatioGnu: parseInt(token.department),
      recAdmGst: 'FILTRAR',
    };
    this.serviceProcVal.regDelAdmin(body).subscribe(
      res => {
        console.log(res);
        this.adminData = new DefaultSelect(res.data);
      },
      err => {
        console.log(err);
      }
    );
  }

  //TRAER DELEGACION QUE ADMINISTRA

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
      (this.admin.value != null ? this.admin.value.delegation : '') +
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
    this.act.reset();
    this.status.reset();
    this.transferent.reset();
    this.destructor.reset();
    this.admin.reset();
    this.folio.reset();
    this.act2.reset();
    this.elabDate.reset();
    this.destroyDate.reset();
    this.address.reset();
    this.observation.reset();
    this.responsible.reset();
    this.witness.reset();
    this.witness2.reset();
    this.destroMethod.reset();
    this.comptrollerWitness.reset();
    this.universalFolio.reset();
    this.dataGoodsAct = new LocalDataSource();
    this.params2 = new BehaviorSubject<ListParams>(new ListParams());
    this.totalItems2 = 0;
    this.weaponCveProceedingFn();
  }

  unsubscribeFn() {}

  //LIMPIAR
  resetTableDataGoods() {
    this.dataGoods.load([]);
    this.totalItems = 0;
    this.params = new BehaviorSubject<ListParams>(new ListParams());
  }

  resetTableDataGoodsAct() {
    this.dataGoodsAct.load([]);
    this.totalItems2 = 0;
    this.params2 = new BehaviorSubject<ListParams>(new ListParams());
  }

  clearForm() {
    this.assembleKeybool = false;
    this.actForm.reset();
    this.resetTableDataGoods();
    this.resetTableDataGoodsAct();
  }

  //ADMINISTRAR BOTON GUARDAR
  saveButton() {
    if (this.isNewProceeding) {
      this.saveProceeding();
    } else {
      this.updateProceeding();
    }
  }

  //GUARDAR NUEVA ACTA
  saveProceeding() {
    const body: IProccedingsDeliveryReception = {
      keysProceedings: this.act2.value,
      elaborationDate: this.elabDate.value,
      datePhysicalReception: this.destroyDate.value,
      address: this.address.value,
      statusProceedings: 'ABIERTA',
      elaborate: this.authService.decodeToken().preferred_username,
      typeProceedings: 'DESTRUCCION',
      numFile: this.expedient.value,
      witness1: this.witness.value,
      witness2: this.witness2.value,
      responsible: this.responsible.value,
      destructionMethod: this.destroMethod.value,
      numDelegation1: this.actForm.get('admin').value.delegationNumber2,
      numDelegation2:
        this.actForm.get('admin').value.delegationNumber2 == 11 ? '11' : null,
      observations: this.actForm.get('observation').value,
      captureDate: new Date().getTime(),
      comptrollerWitness: this.comptrollerWitness.value,
      idTypeProceedings: this.actForm.get('act').value,
    };

    this.serviceProcVal.postProceeding(body).subscribe(
      res => {
        this.alert('success', 'Acta creada', '');
        console.log(res);
      },
      err => {
        this.alert('error', 'Error al crear acta', '');
        console.log(err);
      }
    );
  }

  //ACTUALIZAR ACTA
  updateProceeding() {
    //!FUNCIONALIDAD PARA GUAR
  }

  //NUEVA ACTA
  newProceedingFn() {
    this.newProceeding();
    this.isNewProceeding = true;
    this.assembleKeybool = true;
  }

  //NAVEGACION DE ACTAS
  navigateProceeding() {
    this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        if (this.navigateProceedings) {
          this.loadingProcedure = true;
          // this.dataGoodAct.load([]);
          // this.clearInputs();
          const paramsF = new FilterParams();
          paramsF.page = params.page;
          paramsF.limit = 1;
          paramsF.addFilter('numFile', this.actForm.get('expedient').value);
          paramsF.addFilter('typeProceedings', 'DESTRUCCION', SearchFilter.IN); //!Un in
          this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
            res => {
              console.log(res);
              this.idProceeding = res.data[0].id.toString();
              this.fillIncomeProceeding(res.data[0]);
              this.loadingProcedure = false;
              this.searchGoodsInDetailProceeding();
            },
            err => {
              this.alert('warning', 'No se encontraron actas', '');
              this.loadingProcedure = true;
              this.loading = false;
            }
          );
        }
      });
  }

  //SELECCIONAR BIEN A AGREGAR
  selectGoodFn(e: any) {
    this.selectGood = e.data;
    console.log(this.selectGood);
  }

  selectGoodActFn(e: any) {
    this.selectGoodAct = e.data;
    this.di_status_good = e.data.diStatus;
    console.log(this.selectGoodAct);
  }

  //AGREGAR BIENES A ACTA
  addGood() {
    this.loadingTable = true;
    let act2Value = this.actForm.get('act2').value;

    if (/\/\//.test(act2Value) || /\/ \//.test(act2Value)) {
      this.alert('warning', 'La clave de acta es incorrecta', '');
      this.loadingTable = false;
      return;
    }

    if (this.selectGood == null) {
      this.alert('warning', 'Seleccione primero el bien a asignar', '');
      this.loadingTable = false;
      return;
    }

    if (this.actForm.get('act2').value == null) {
      this.alert(
        'warning',
        'No existe un acta, en la cual asignar el bien. Capture primero el acta',
        ''
      );
      this.loadingTable = false;
      return;
    }

    if (
      ['CERRADO', 'CERRADA'].includes(
        this.actForm.get('statusProceeding').value
      )
    ) {
      this.alert(
        'warning',
        'El acta se encuentra cerrada',
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
      this.loadingTable = false;
      return;
    }

    if ([null, ''].includes(this.actForm.get('statusProceeding').value)) {
      this.alert(
        'warning',
        'El acta no tiene un estatus válido',
        'El acta no tiene un estatus válido, no puede realizar modificaciones a esta'
      );
      this.loadingTable = false;
      return;
    }

    if (this.selectGood.avalaible == false) {
      this.alert(
        'warning',
        'Bien no disponible',
        'El bien tiene un estatus invalido para ser asignado a alguna acta'
      );
      this.loadingTable = false;
      return;
    }

    if (this.selectGood.acta != null) {
      this.alert(
        'warning',
        'Bien ya asignado',
        'El bien ya esta asignado a una acta'
      );
      this.loadingTable = false;
      return;
    }

    const body: IDetailProceedingsDeliveryReception = {
      numberProceedings: this.proccedingId,
      numberGood: this.selectGood.goodId,
      amount: this.selectGood.quantity,
      exchangeValue: 1,
      approvedUserXAdmon: this.authService.decodeToken().preferred_username,
    };

    this.serviceDetailProc.addGoodToProceedings(body).subscribe(
      res => {
        console.log(res);
        this.searchGoodsInDetailProceeding();
        this.searchGoodsByExp();
        this.loadingTable = false;
      },
      err => {
        console.log(err);
        this.alert('error', 'Error al agregar bien', '');
        this.loadingTable = false;
      }
    );
  }

  deleteGood() {
    this.loadingTable = true;

    if (
      ['CERRADO', 'CERRADA'].includes(
        this.actForm.get('statusProceeding').value
      )
    ) {
      this.alert(
        'warning',
        'El acta se encuentra cerrada',
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
      this.loadingTable = false;
      return;
    }

    if (this.actForm.get('act2').value == null) {
      this.alert(
        'warning',
        'No existe un acta',
        'Debe especificar/buscar el acta para despues eliminar el bien de esta'
      );
      this.loadingTable = false;
      return;
    }

    if (this.selectGoodAct == null) {
      this.alert(
        'warning',
        'No hay bien seleccionado',
        'Debe seleccionar un bien que forme parte del acta primero'
      );
      this.loadingTable = false;
      return;
    }

    const deleteModel: IDeleteDetailProceeding = {
      numberGood: this.selectGoodAct.good.goodId,
      numberProceedings: this.idProceeding,
    };

    this.serviceDetailProc.deleteDetailProcee(deleteModel).subscribe(
      res => {
        console.log(res);
        this.searchGoodsInDetailProceeding();
        this.searchGoodsByExp();
        this.loadingTable = false;
      },
      err => {
        console.log(err);
        this.alert('error', 'Error al eliminar bien', '');
        this.loadingTable = false;
      }
    );
  }

  //CERRAR ACTA
  async closeButton() {
    if (
      this.optionRB.get('option').value == 'P' &&
      ['CERRADO', 'CERRADA'].includes(this.status.value)
    ) {
      this.pupGenMasiv();
    } else {
      this.pupMovimientoActa();
    }
  }

  pupGenMasiv() {
    const body: IQueryRegAdminGood = {
      selPaq: '',
      statusRecord: '',
      blockStatus: '',
      user: '',
      packageNumber: '',
      proceedingNumber: '',
      minutesNumber: '',
      typeMinutes: '',
    };

    this.serviceProceeding.queryRegAdminGood(body).subscribe(
      res => {
        console.log(res);

        //!COLOCAR V_STATUS
        this.alert('success', 'Actualización de paquete', '');
      },
      err => {
        console.log(err);
        this.alert('error', 'Error al actualizar paquete', '');
      }
    );
  }

  async validateFolio() {
    return new Promise((resolve, reject) => {
      this.documentService.getByFolio(this.universalFolio.value).subscribe(
        res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          console.log(scanStatus);
          if (scanStatus === 'ESCANEADO') {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        err => {
          resolve(false);
        }
      );
    });
  }

  async pupMovimientoActa() {
    const user = this.authService.decodeToken().preferred_username;
    if (['CERRADO', 'CERRADA'].includes(this.status.value)) {
      this.openProceeding(user);
    } else {
      this.closeProceeding(user);
    }
  }

  closeProceeding(user: string) {
    const paramsF = new FilterParams();
    paramsF.addFilter('valUser', user);
    paramsF.addFilter('valMinutesNumber', this.idProceeding);
    this.serviceProgrammingGood
      .getTmpProgValidation(paramsF.getParams())
      .subscribe(
        res => {
          const val_MOVIMIENTO = res.data[0]['valmovement'];

          if (val_MOVIMIENTO == 1) {
            const lv_TIP_ACTA = 'DS,DESTRUCCION';
            this.closeOpenProceeding();
          } else {
            this.primaryClose();
          }
        },
        err => {
          this.primaryClose();
        }
      );
  }

  async validInputs() {
    if (this.act2.value == null) {
      this.alert('warning', 'No existe acta para cerrar', 'a');
      return;
    }

    if (this.elabDate.value == null) {
      this.alert('warning', 'Debe ingresar la fecha de elaboración', '');
      return;
    }

    if (this.destroyDate.value == null) {
      this.alert('warning', 'Debe ingresar la fecha de destrucción', '');
      return;
    }

    if (this.destroyDate.value > this.elabDate.value) {
      this.alert(
        'warning',
        'La fecha de destrucción no puede ser mayor a la fecha de elaboración',
        ''
      );
      return;
    }

    if (this.universalFolio.value == null) {
      this.alert('warning', 'Indique el folio de escaneo', '');
      return;
    }

    const folioStatus = await this.validateFolio();

    if (!folioStatus) {
      this.alert('warning', 'No se ha realizado el escaneo', '');
      return;
    }

    if (this.comptrollerWitness.value == null) {
      this.alert('warning', 'Indique el testigo de la contraloría', '');
      return;
    }

    if (this.dataGoodsAct.count() == 0) {
      this.alert(
        'warning',
        'No hay bienes en el acta',
        'El acta no tiene ningun bien asignado, no se puede cerrar'
      );
      return;
    }

    const validTerm = await this.validTerm();

    if (validTerm) {
      this.alert('warning', 'Está fuera de tiempo para cerrar el acta', '');
      return;
    }
  }

  async primaryClose() {
    await this.validInputs();
    const body: IPupMovDestruction = {
      proceeding: this.idProceeding,
      screen: 'FACTDESACTASDESTR',
      proceedingType: 'DESTRUCCION',
      user: this.authService.decodeToken().preferred_username,
      date: this.destroyDate.value,
    };

    this.serviceProceeding.pupMovementDestruction(body).subscribe(
      res => {
        console.log(res);
        if (
          res.message ==
          '1 o más bienes no cuentan con una constancia de entrega cerrada'
        ) {
          this.alert('warning', 'Error al cerrar acta', res.message);
        } else if (
          res.message ==
          'Alguno de los bienes se encuentra en más de una Constancia'
        ) {
          this.alert('warning', 'Error al cerrar acta', res.message);
        } else if (
          res.message == 'Al tratar de buscar la constancia de los bienes.'
        ) {
          this.alert('warning', 'Error al cerrar acta', res.message);
        } else {
          this.alert('success', 'Acta cerrada', '');
        }
      },
      err => {
        this.alert('error', 'Error al cerrar acta', '');
      }
    );
  }

  async closeOpenProceeding() {
    this.validInputs();

    const body: IPupMovDestruction = {
      proceeding: this.idProceeding,
      screen: 'FACTDESACTASDESTR',
      proceedingType: 'DESTRUCCION',
      user: this.authService.decodeToken().preferred_username,
      date: this.destroyDate.value,
    };

    this.serviceProceeding.pupMovementDestruction(body).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  async validTerm() {
    return new Promise((resolve, reject) => {
      const body: IPufValidTerm = {
        delegationNumber: parseInt(this.authService.decodeToken().department),
        elaborationDate: this.elabDate.value,
      };

      this.serviceProceeding.pufValidTerm(body).subscribe(
        res => {
          resolve(res.vban);
        },
        err => {
          resolve(false);
        }
      );
    });
  }

  openProceeding(user: string) {
    this.alertQuestion(
      'question',
      `¿Está seguro de abrir el Acta ${this.act2.value}?`,
      ''
    ).then(q => {
      if (q.isConfirmed) {
        const lv_TIP_ACTA = 'DS,DESTRUCCION';
        const modelPaOpen: IPAAbrirActasPrograma = {
          P_NOACTA: this.idProceeding,
          P_AREATRA: lv_TIP_ACTA,
          P_PANTALLA: 'FACTDESACTASDESTR',
          P_TIPOMOV: 2,
          USUARIO: user,
        };

        this.serviceProgrammingGood
          .paOpenProceedingProgam(modelPaOpen)
          .subscribe(
            res => {
              const paramsF = new FilterParams();
              paramsF.addFilter('valUser', user);
              paramsF.addFilter('valMinutesNumber', this.idProceeding);
              this.serviceProgrammingGood
                .getTmpProgValidation(paramsF.getParams())
                .subscribe(
                  async res => {
                    const val_MOVIMIENTO = res.data[0]['valmovement'];

                    if (val_MOVIMIENTO == 1) {
                      const resp = await this.getVValido();
                      if (resp['data'].length > 0) {
                        this.serviceProgrammingGood
                          .paRegresaEstAnterior(modelPaOpen)
                          .subscribe(
                            res => {
                              this.alert(
                                'warning',
                                'Error al abrir acta',
                                'El acta no pudo regresar a su estado anterior'
                              );
                              return;
                            },
                            err => {
                              this.alert(
                                'error',
                                'Error al regresar el estado anterior del acta',
                                ''
                              );
                              return;
                            }
                          );
                      } else {
                        this.alert('success', 'Acta abierta', '');
                        return;
                      }
                    } else {
                      this.alert('success', 'Acta abierta', '');
                      return;
                    }
                  },
                  err => {
                    this.alert('error', 'Error al abrir acta', '');
                    return;
                  }
                );
            },
            err => {
              this.alert('error', 'Error al abrir acta', '');
              return;
            }
          );
      }
    });
  }

  async getVValido() {
    const paramsF = new FilterParams();
    paramsF.addFilter('typeProceedings', 'CONSENTR');
    paramsF.addFilter('idTypeProceedings', 'E/DES');
    paramsF.addFilter('statusProceedings', 'CERRADA, CERRADO', SearchFilter.IN);
    paramsF.addFilter('numFile', this.expedient.value);
    return new Promise((resolve, reject) => {
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          resolve(true);
        },
        err => {
          resolve(false);
        }
      );
    });
  }
}
