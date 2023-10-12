import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  of,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  MyBody,
  OfficesSend,
  SendObtainGoodValued,
  UserFind,
  ValidationResponseFile,
} from './res-cancel-valuation-class/class-service';
import {
  MOT_CAN,
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
  VALUATION_REQUEST_COLUMNS_VALIDATED,
  VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
} from './res-cancel-valuation-columns';

@Component({
  selector: 'app-res-cancel-valuation',
  templateUrl: './res-cancel-valuation.component.html',
  styles: [],
})
export class resCancelValuationComponent extends BasePage implements OnInit {
  //

  //#region Vars
  // Modal
  @ViewChild('modalRev', { static: true })
  miModalRev: TemplateRef<any>;

  arrayResponseOffice: any[] = [];
  arrayResponseOfficeTwo: any[] = [];
  array: any[] = [];

  //Forms
  form: FormGroup;
  formTwo: FormGroup;
  formThree: FormGroup;

  // Select
  offices = new DefaultSelect();
  fullCyties = new DefaultSelect();
  sender = new DefaultSelect();
  fullUsersTwo = new DefaultSelect();
  fullUsers = new DefaultSelect();
  fullDelegations = new DefaultSelect();
  fullDepartments = new DefaultSelect();
  usersList = new DefaultSelect();
  usersCopyList = new DefaultSelect();
  lsbConCopiaList: any[] = [];
  arrayCopy: string[] = [];

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsTwo: number = 0;
  paramsTwo = new BehaviorSubject<ListParams>(new ListParams());
  dateNow: Date;
  intervalId: any;
  listCitys: any;
  listKeyOffice: any;
  settingsTwo: any;
  subscribeDelete: Subscription;
  city: any;
  rowCopySelect: any;
  varCount: number = 0;
  idOficio: any = 0;

  //Var Data Table
  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();

  //Var asiggn
  lblTipoAccOficio: any = '-';
  lbltipOficio: any = '-';
  lblDireccion: any = '-';
  lblCvlOfocio: any = '-';
  idOffice: number;
  countCopy: number = 0;

  //Var Validation
  radioValueThree: boolean = false;
  pnlControles: boolean = true;
  pnlControles2: boolean = true;
  btnVerOficio: boolean = true;
  btnEnviar: boolean = true;
  btnModificar: boolean = true;
  btnGuardar: boolean = true;
  btnMotCan: boolean = true;
  byUser: boolean = false;
  visibleUserName: boolean = true;
  visibleDelegation: boolean = false;
  visibleTxtCopy: boolean = true;
  visibleDepartments: boolean = false;

  // Modal #1
  formDialogOne: FormGroup;

  // Modal #2
  dataModal: LocalDataSource = new LocalDataSource();
  settingsModal: any;
  paramsModal = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsModal: number = 0;
  //#endregion

  //

  //#region Initialization
  constructor(
    private fb: FormBuilder,
    private serviceJobs: JobsService,
    private cityService: CityService,
    private datePipe: DatePipe,
    private serviceAppraise: AppraiseService,
    private generateCveService: GenerateCveService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceUser: GenerateCveService,
    private serviceDelegations: DelegationService,
    private serviceDepartments: DepartamentService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };

    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
    };

    // Modal #2
    this.settingsModal = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...MOT_CAN },
    };
    this.prepareForm();
    this.form
      .get('event')
      .valueChanges.pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe({
        next: response => {
          console.log(response);
          if (response && this.form.get('radio').value) {
            this.changeRatio(this.form.get('radio').value);
          }
        },
      });
    this.form
      .get('radio')
      .valueChanges.pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);

          if (response) {
            this.changeRatio(response);
          }
        },
      });
  }

  private changeRatio(radioValue: any) {
    if (this.event != '' && this.event != null) {
      this.btnMotCan = false;
      this.resetVariables();
      this.loadOffice(this.event, radioValue);
      this.setButtons(3);
    } else {
      this.alert(
        'warning',
        'Advertencia',
        `Inserta un evento para poder continuar`
      );
      // this.form.controls['radio'].reset();
    }
  }

  ngOnInit() {
    this.byUser = true;

    this.updateHour();
    this.intervalId = setInterval(() => {
      this.updateHour();
    }, 1000);

    this.setButtons(3);

    this.queryAllUsers();

    this.queryAllUsersTwo();

    this.queryCyties();

    this.queryDelegations();

    this.route.queryParams.subscribe(params => {
      if (params['event'] != undefined && params['type'] != undefined) {
        let body: OfficesSend = new OfficesSend();
        body.eventId = +params['event'];
        body.officeType = +params['type'];
        this.loadOffice(body.eventId, body.officeType);
      }
    });
  }

  //#endregion

  //

  getAddUser(event?: any) {
    // if (this.form.controls['user'].value) {
    //   let usuariocopia: string = '';
    //   let verificauser: boolean = false;
    //   if (this.lsbConCopiaList.length > 0) {
    //     for (const value of this.lsbConCopiaList) {
    //       usuariocopia = value.splint('-').toString();
    //       if (usuariocopia == this.form.controls['user'].value) {
    //         verificauser = true;
    //       }
    //     }
    //     if (verificauser != true) {
    //       this.lsbConCopiaList.push(this.form.controls['user'].value);
    //     }
    //   }
    // } else {
    //   this.alert('warning', 'Debe seleccionar un usuario', '');
    // }
    this.alertQuestion(
      'question',
      'Agregar Usuario',
      '¿Desea agregar un usuario?'
    ).then(x => {
      if (x.isConfirmed) {
        let countCopyLocal = this.countCopy + 1;
        this.countCopy = countCopyLocal;
        if (this.radioValueThree == false) {
          this.arrayCopy.push(
            `${countCopyLocal}/${this.formThree.controls['user'].value}`
          );
        } else {
          this.arrayCopy.push(
            `${countCopyLocal}/EXTERNO-${this.formThree.controls['depar'].value?.descripcion}`
          );
        }
      }
    });
  }

  removeUserCopy() {
    this.alertQuestion(
      'question',
      'Agregar Usuario',
      '¿Desea agregar un usuario?'
    ).then(x => {
      if (x.isConfirmed) {
        if (this.formThree.controls['copy'].value != null) {
          let indice = Number(
            String(this.formThree.controls['copy'].value).charAt(0)
          );
          console.log('Este es el índice: ', indice - 1);
          console.log('Este es el array: ', this.arrayCopy);
          this.arrayCopy.splice(indice - 1, 1);
        } else {
          this.alert('info', 'Selecciona un registro', '');
        }

        const valorFormulario = this.formThree.controls['copy'].value;

        // Encuentra el índice del elemento que coincide con el valor del formulario
        const indice = this.arrayCopy.indexOf(valorFormulario);

        // Si se encuentra el elemento, elimínalo
        if (indice !== -1) {
          this.arrayCopy.splice(indice, 1);
        } else {
          // Aquí puedes manejar el caso en que el elemento no se encuentra
          console.log('Elemento no encontrado');
        }
      }
    });
  }

  //#region Users
  getUserService(body: any, event: any): Observable<any> {
    return new Observable(observer => {
      this.serviceUser.postSpUserAppraisal(body, event).subscribe({
        next: response => {
          observer.next(response);
          observer.complete();
        },
        error: error => {
          observer.error(error);
        },
      });
    });
  }

  getUsersDesList(params?: ListParams) {
    let userBody: UserFind = new UserFind();
    userBody.flagIn = 2;
    if (params !== undefined) {
      if (params?.text != '') {
        params['filter.usuario'] = `$eq:${params?.text.toUpperCase()}`;
      }
    }
    this.getUserService(userBody, params).subscribe(userList => {
      this.usersList = new DefaultSelect(userList?.data, userList?.count || 0);
    });
  }

  queryAllUsers(params?: ListParams) {
    let userBody: UserFind = new UserFind();
    userBody.flagIn = 1;
    if (params !== undefined) {
      if (params?.text != '') {
        params['filter.usuario'] = `$eq:${params?.text.toUpperCase()}`;
      }
    }
    this.getUserService(userBody, params).subscribe(arrayRemi => {
      this.fullUsers = new DefaultSelect(
        arrayRemi?.data,
        arrayRemi?.count || 0
      );
    });
  }

  get pathDest() {
    return 'security/api/v1/application/spUserAppraisal';
  }

  get bodyDest() {
    return {
      flagIn: 2,
    };
  }

  queryAllUsersTwo(params?: ListParams) {
    let userBody: UserFind = new UserFind();
    userBody.flagIn = 2;
    if (params !== undefined) {
      if (params.text != '') {
        params['filter.usuario'] = `$eq:${params.text.toUpperCase()}`;
      }
    }
    this.getUserService(userBody, params).subscribe(arrayDes => {
      this.fullUsersTwo = new DefaultSelect(
        arrayDes?.data,
        arrayDes?.count || 0
      );
    });
  }
  //#endregion

  //#region   Cityes
  queryCyties(params?: any) {
    this.cityService.getAllCitysTwo(params).subscribe({
      next: response => {
        this.fullCyties = new DefaultSelect(response?.data, response?.count);
      },
      error: error => {
        this.loader.load = false;
        this.fullCyties = new DefaultSelect([], 0, true);
      },
    });
  }
  //#endregion

  //#region Delegations
  queryDelegations(params?: ListParams) {
    this.serviceDelegations.getAllThree().subscribe({
      next: response => {
        this.fullDelegations = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.fullDelegations = new DefaultSelect([], 0);
      },
    });
  }
  //#endregion

  //#region Departments
  getDepartments(event?: any) {
    console.log('Este es el valor: ', this.formThree.controls['del'].value);
    if (this.formThree.controls['del'].valid) {
      console.log(
        'Este es el valor: ',
        this.formThree.controls['del'].value?.delegationId
      );
      this.serviceDepartments
        .getDepartments(this.formThree.controls['del'].value?.delegationId)
        .subscribe({
          next: response => {
            console.log(
              'Esta es la respuesta de los departementos: ',
              response.data
            );
            this.fullDepartments = new DefaultSelect(
              response.data,
              response.count || 0
            );
          },
          error: error => {
            this.fullDepartments = new DefaultSelect([], 0);
          },
        });
    }
  }
  //#endregion

  get event() {
    return this.form.get('event') ? this.form.get('event').value : null;
  }

  set event(value) {
    if (this.form.get('event')) {
      this.form.get('event').setValue(value);
    }
  }

  onRadioChangeThree() {
    this.radioValueThree = true;
    if (this.byUser == false) {
      this.visibleUserName = true;
      this.visibleDelegation = false;
      this.visibleTxtCopy = true;
      this.visibleDepartments = false;
      this.byUser = true;
    } else {
      this.visibleUserName = false;
      this.visibleDelegation = true;
      this.visibleTxtCopy = false;
      this.byUser = false;
      this.visibleDepartments = true;
    }
  }

  getOffices(event?: any) {
    this.serviceJobs.getAll(event).subscribe({
      next: data => {
        this.offices = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.offices = new DefaultSelect();
      },
    });
  }

  resetVariables() {
    this.byUser = true;
    this.form.controls['ref'].reset();
    this.form.controls['espe'].reset();
    this.form.controls['aten'].reset();
    this.form.controls['key'].reset();
    this.formTwo.controls['allGood'].reset();
    this.formTwo.controls['selectedGood'].reset();
    this.visibleUserName = true;
    this.visibleDelegation = false;
    // this.form.controls['radio'].reset();
    // this.redioValueTwo = false;
    this.visibleDelegation = false;
    this.visibleDepartments = false;
    this.formThree.controls['radioThree'].setValue(false);
    this.rowCopySelect = '';
    this.countCopy = 0;
  }

  getCityById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cityService.getId(id).subscribe({
        next: response => {
          this.city = response;
          resolve(this.city);
        },
        error: error => {
          this.loader.load = false;
          this.fullCyties = new DefaultSelect([], 0, true);
          reject(error);
        },
      });
    });
  }

  getOfficeResponseTwo(body: OfficesSend): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.serviceJobs.postByFilters(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }

  async findOfficeService(data: any) {
    let valorObjeto: any;
    valorObjeto = data;
    let body: OfficesSend = new OfficesSend();
    body.eventId = valorObjeto?.eventId;
    body.officeType = valorObjeto?.jobType;
    this.arrayResponseOffice = await this.getOfficeResponseTwo(body);
    this.findOffice(this.arrayResponseOffice);
  }

  loadOffice(event: number, num: number, arrayLength?: number) {
    let body: OfficesSend = new OfficesSend();
    body.eventId = event;
    body.officeType = num;
    this.getOfficeResponse(body, num, arrayLength);
  }

  async viewOffice() {
    try {
      let dataOffice: any[] = [];
      let type: ValidationResponseFile = new ValidationResponseFile();
      let body: OfficesSend = new OfficesSend();
      let myBody: MyBody = new MyBody();
      let tituloOficio: any;

      body.eventId = this.event;
      body.officeType = this.returnOfOffice();
      dataOffice = await this.getOfficeRequest(body);
      for (const x of dataOffice) {
        type.description = x.direccion;
        type.descriptionTypeOffice = x.des_tipo_oficio;
        type.typeOffice = x.id_tpsolaval;
        type.address = x.direccion;
      }

      if (type.typeOffice == 2) {
        if (this.returnOfOffice() == 2) {
          tituloOficio = this.getDescriptionParameters('OFI_RES_V');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        } else if (this.returnOfOffice() == 3) {
          tituloOficio = this.getDescriptionParameters('OFI_CAN_V');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        }
      } else if (type.typeOffice == 3) {
        if (this.returnOfOffice() == 2) {
          tituloOficio = this.getDescriptionParameters('OFI_RES_A');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        } else if (this.returnOfOffice() == 3) {
          tituloOficio = this.getDescriptionParameters('OFI_CAN_A');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        }
      }
    } catch (e: any) {
      this.alert('warning', '', 'Problema para visualizar oficio');
    }
  }

  //No esta en la documentacion
  getDescriptionParameters(nameOffice: string) {}

  async getDataByOffice(): Promise<MyBody> {
    let myBody: MyBody = new MyBody();
    let arrayDataOffice: any[] = [];
    let body: OfficesSend = new OfficesSend();
    let listGoods: string = '';

    body.eventId = this.event;
    body.officeType = this.returnOfOffice();
    arrayDataOffice = await this.getOfficeResponseTwo(body);

    for (const x of arrayDataOffice) {
      myBody.level1 = x.nivel1;
      myBody.level2 = x.nivel2;
      myBody.level3 = x.nivel3;
      myBody.officeCode = x.cve_oficio;
      myBody.recipient = x.nom_destinatario;
      myBody.recipientPosition = x.cargo_destina;
      myBody.sendDate = this.datePipe.transform(x.fecha_insert, 'dd/MM/yyyy');
      myBody.cityName = x.nom_ciudad;
      myBody.text1 = x.texto1;
      myBody.text2 = x.texto2;
      myBody.text3 = x.texto3;
      myBody.sender = x.nom_remitente;
      myBody.senderPosition = x.cargo_rem;
    }

    let noGood: any[] = [];
    noGood = this.getGoodsWithOffice(this.returnIdOffice());
    for (const x of noGood) {
      listGoods = listGoods + x.no_bien + ', ';
    }

    myBody.goodsList = listGoods;

    return myBody;
  }

  //No hay servicio en la documentacion
  getGoodsWithOffice(idOffice: number) {
    let arrayNumGoods: [] = [];

    return arrayNumGoods;
  }

  generateReport(myBody: MyBody, address: any) {}

  returnIdOffice(): number {
    let num: number = 0;
    num = Number(this.form.controls['office'].value?.jobId);
    return num;
  }

  getOfficeRequest(body: any) {
    return firstValueFrom(
      this.serviceJobs.postByFiltersResponse(body).pipe(
        take(1),
        catchError(x => of({ data: [] })),
        map(x => x.data)
      )
    );
  }

  async getOfficeResponse(body: any, type?: number, arrayLength?: number) {
    this.array = await this.getOfficeRequest(body);
    if (this.array.length > 0) {
      for (const i of this.array) {
        this.lblTipoAccOficio = String(i?.des_tipo_oficio).toUpperCase();
        if (i?.tipo == 'VALOR') {
          this.lbltipOficio = ' DE REFERENCIA DE ' + i?.tipo;
        } else if (i?.tipo == 'AVALUO') {
          this.lbltipOficio = ' DE AVALUO ';
        }
        if (i?.direccion == 'I') {
          this.lblDireccion = ' INMUEBLES ';
        } else if (i?.direccion == 'M') {
          this.lblDireccion = ' MUEBLES ';
        } else if (i?.direccion == 'A') {
          this.lblDireccion = ' ACTIVOS FINANCIEROS ';
        }
        this.lblCvlOfocio = i?.cve_oficio;
        // this.event = i?.id_evento;

        this.form.controls['dateRec'].setValue(this.dateFormat(i?.fecha_envia));
        this.form.controls['dateEla'].setValue(
          this.dateFormat(i?.fecha_insert)
        );
        this.form.controls['ref'].setValue(
          this.form.controls['ref'].value +
            '\n' +
            i?.referen +
            ' ' +
            this.lblDireccion
        );
        this.form.controls['aten'].setValue(
          this.form.controls['aten'].value +
            '\n' +
            i?.atencion +
            ' ' +
            this.lblCvlOfocio
        );
        this.form.controls['fol'].setValue(i?.fol);
        if (type == 2) {
          this.obtainsValuedAssets(2, 0);
          // this.radioValueOne = true;
          this.btnMotCan = false;
        } else if (type == 3) {
          this.obtainsValuedAssets(3, 0);
          // this.redioValueTwo = true;
          this.btnMotCan = true;
        }
      }
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'No existe ninguna solicitud de oficio para este evento. verifique que se haya realizado la solicitud para poder continuar'
      );
    }
  }

  async findOffice(array: any[]) {
    if ((this.idOficio = this.form.controls['office'].value?.jobId > 0)) {
      for (const i of array) {
        try {
          await this.getCityById(i?.ciudad);
          if (this.city) {
            if (i?.tipo_oficio == 2) {
              this.form.get('radio').setValue('2');
            } else if (i?.tipo_oficio == 3) {
              this.form.get('radio').setValue('3');
            }
            // this.loadOffice(
            //   this.form.controls['event'].value,
            //   this.returnOfOffice(),
            //   array.length
            // );
            this.form.patchValue({
              dest: i?.destinatario,
              key: i?.cve_oficio,
              remi: i?.remitente,
              cityCi: this.city.legendOffice,
              ref: i?.texto1,
              aten: i?.texto2,
              espe: i?.texto3,
              fol: i?.num_cv_armada,
            });
          }
        } catch (error) {}
        let statusOffice: string = i?.estatus_of;
        this.validateFindOfficeOne(statusOffice);
      }
    } else {
      this.setButtons(3);
      this.resetVariables();
      this.pnlControles = true;
      this.pnlControles2 = true;
      if (this.returnOfOffice() == 2) {
        this.settings = {
          ...this.settings,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS },
        };
      } else if (this.returnOfOffice() == 3) {
        this.settingsTwo = {
          ...this.settingsTwo,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
        };
      }
    }
  }

  validateFindOfficeOne(status: any) {
    if (status == 'ENVIADO') {
      this.pnlControles = false;
      this.pnlControles2 = false;
      this.setButtons(1);
      if (this.returnOfOffice() == 2) {
        this.settings = {
          ...this.settings,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS_VALIDATED },
        };
      } else if (this.returnOfOffice() == 3) {
        this.settingsTwo = {
          ...this.settingsTwo,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS_VALIDATED_TWO },
        };
      }
    } else {
      this.pnlControles = true;
      this.pnlControles2 = true;
      this.setButtons(2);
      if (this.returnOfOffice() == 2) {
        this.settings = {
          ...this.settings,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS },
        };
      } else if (this.returnOfOffice() == 3) {
        this.settingsTwo = {
          ...this.settingsTwo,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
        };
      }
    }
    this.idOficio = this.form.controls['office'].value?.jobId;
    if (this.returnOfOffice() == 2) {
      this.obtainsValuedAssets(4, this.idOficio);
    } else if (this.returnOfOffice() == 3) {
      this.obtainsCancelAssets(5, this.idOficio);
    }
  }

  setButtons(ac: number) {
    if (ac == 1) {
      this.btnVerOficio = true;
      this.btnEnviar = false;
      this.btnModificar = false;
      this.btnGuardar = false;
    } else if (ac == 2) {
      this.btnGuardar = false;
      this.btnEnviar = true;
      this.btnVerOficio = true;
      this.btnModificar = true;
    } else if (ac == 3) {
      this.btnGuardar = true;
      this.btnEnviar = false;
      this.btnVerOficio = false;
      this.btnModificar = false;
    } else if (ac == 4) {
      this.btnGuardar = false;
      this.btnEnviar = true;
      this.btnVerOficio = true;
      this.btnModificar = true;
    } else if (ac == 5) {
      this.btnGuardar = false;
      this.btnEnviar = false;
      this.btnVerOficio = false;
      this.btnModificar = false;
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      event: [null],
      cveService: [null],
      fol: [null],
      key: [null],
      cityCi: [null],
      dateRec: [null],
      dateEla: [null],
      remi: [null],
      dest: [null],
      office: [null],
      ref: [null],
      aten: [null],
      espe: [null],
      radio: [null],
    });
    this.formTwo = this.fb.group({
      allGood: [null],
      selectedGood: [null],
    });
    this.formDialogOne = this.fb.group({
      noti: [null],
    });
    this.formThree = this.fb.group({
      user: [null],
      del: [null],
      depar: [null],
      copy: [null],
      radioThree: [null],
    });
    this.subscribeDelete = this.form
      .get('office')
      .valueChanges.subscribe(value => {
        this.findOfficeService(value);
      });
  }

  getUsersList(params: ListParams) {
    let data = {
      flagIn: 1,
    };
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        this.sender = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.sender = new DefaultSelect([], 0, true);
      },
    });
  }

  obtainsValuedAssets(numOne: number, numTwo: number) {
    let body: SendObtainGoodValued = new SendObtainGoodValued();
    body.idEventIn = this.event;
    body.idJobIn = numTwo;
    body.tpJobIn = numOne;
    this.serviceAppraise.postGetAppraise(body).subscribe({
      next: response => {
        if (response.data && Array.isArray(response.data)) {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count || 0;
          this.loading = false;
        } else {
          this.data.load(response);
          this.data.refresh();
          this.totalItems = response.count || 0;
          this.loading = false;
        }
      },
      error: error => {
        if (error.status == 400) {
          this.alert(
            'warning',
            'Advertencia',
            'No hay bienes para realizar el oficio de respuesta'
          );
        }
        this.loader.load = false;
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  obtainsCancelAssets(numOne: number, numTwo: number) {
    let body: SendObtainGoodValued = new SendObtainGoodValued();
    body.idEventIn = this.event;
    body.idJobIn = numTwo;
    body.tpJobIn = numOne;
    this.serviceAppraise.postGetAppraise(body).subscribe({
      next: response => {
        if (response.data && Array.isArray(response.data)) {
          this.dataTwo.load(response.data);
          this.dataTwo.refresh();
          this.totalItemsTwo = response.count || 0;
          this.loading = false;
        } else {
          this.dataTwo.load(response);
          this.dataTwo.refresh();
          this.totalItemsTwo = response.count || 0;
          this.loading = false;
        }
      },
      error: error => {
        if (error.status == 400) {
          this.alert(
            'warning',
            'Advertencia',
            'No hay bienes para realizar el oficio de cancelación'
          );
        }
        this.loader.load = false;
        this.loading = false;
        this.dataTwo.load([]);
        this.dataTwo.refresh();
      },
    });
  }

  returnOfOffice(): number {
    let num: number = 0;
    if (this.form.get('radio').value == 'E') {
      num = 2;
    } else if (this.form.get('radio').value == 'I') {
      num = 3;
    }
    return num;
  }

  updateHour(): void {
    this.dateNow = new Date();
  }

  dateFormat(date: any) {
    let dateLocal: any;
    dateLocal = this.datePipe.transform(date, 'dd/MM/yyyy');
    return dateLocal;
  }

  //#region Excel
  //Export and Import Excel
  exportExcel() {}
  //#endregion

  // Metodo del modal #2
  getReasonsChange() {
    let eventGlobal: number;
    eventGlobal = this.event;
    this.serviceJobs.getMoCanById(eventGlobal).subscribe({
      next: response => {
        this.dataModal.load(response.data[0]);
        this.dataModal.refresh();
        this.totalItemsModal = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loader.load = false;
        this.loading = false;
        this.dataModal.load([]);
        this.dataModal.refresh();
      },
    });
  }
  selectedRowsCancel: Array<any> = [];
  selectedRows: Array<any> = [];

  onUserRowSelect(event: any): void {
    this.selectedRows = event.selected; // Aquí, event.selected te dará todas las filas seleccionadas
  }

  onUserRowSelectCancel(event: any): void {
    this.selectedRowsCancel = event.selected; // Aquí, event.selected te dará todas las filas seleccionadas
  }

  modifySelectedRows(): void {
    let motivos = '';
    let noMot = '';
    let noCaracteres = '';
    this.selectedRows.forEach(row => {
      noMot += row.id_motivo + ',';
      motivos += row.descripcion_motivo + '/';
    });

    this.selectedRowsCancel.forEach(row => {
      if (row.motivos == ' ') {
        row.motivos += motivos;
      }
    });

    this.dataTwo.refresh();
  }
  //

  reasonsForChange() {
    this.modalService.show(this.miModalRev, {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    });
    this.getReasonsChange();
  }

  updateOffice() {}

  countGoodsSelected() {
    let typeOffice: number = this.returnOfOffice();
    if (typeOffice == 2) {
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario seleccionar bienes'
        );
      }
    } else if (typeOffice == 3) {
      this.addReasons();
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario seleccionar bienes'
        );
      }
      let countOne: number = 0;
      let countTwo: number = 0;
      for (const x of this.selectedRowsCancel) {
        countOne++;
        if (x.motivos != ' ') {
          countTwo++;
        }
      }
      if (countOne != countTwo) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien'
        );
      }
    }
  }

  addReasons() {
    this.validatedReasons();
    let arrayChange: any[] = [];
    for (const x of this.selectedRowsCancel) {
      this.changeChar(x.motivos);
      arrayChange = x;
    }
    this.selectedRowsCancel = arrayChange;
  }

  validatedReasons() {
    if (this.returnOfOffice() == 3) {
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien'
        );
      }
    }
  }

  changeChar(chain: string): string {
    let replacements = [
      { from: '&nbsp;', to: '' },
      { from: 'nbsp;', to: '' },
      { from: 'amp;NBSP;', to: '' },
      { from: '&amp;nbsp;', to: '' },
      { from: '&amp;amp;nbsp;', to: '' },
      { from: '&AMP;AMP;NBSP;', to: '' },
      { from: '&amp;', to: '' },
      { from: '&AMP;', to: '' },
      { from: '&#193;', to: 'Á' },
      { from: '#193;', to: 'Á' },
      { from: '&#225;', to: 'á' },
      { from: '#225;', to: 'á' },
      { from: '&#201;', to: 'É' },
      { from: '#201;', to: 'É' },
      { from: '&#233;', to: 'é' },
      { from: '#233;', to: 'é' },
      { from: '&#205;', to: 'Í' },
      { from: '&#237;', to: 'í' },
      { from: '&#211;', to: 'Ó' },
      { from: '#211;', to: 'Ó' },
      { from: '&#243;', to: 'ó' },
      { from: '#243;', to: 'ó' },
      { from: '&#218;', to: 'Ú' },
      { from: '#218;', to: 'Ú' },
      { from: '&#250;', to: 'ú' },
      { from: '#250;', to: 'ú' },
      { from: '&amp;amp;#225;', to: 'á' },
      { from: '&amp;amp;#233;', to: 'é' },
      { from: '&amp;amp;#237;', to: 'í' },
      { from: '&amp;amp;#243;', to: 'ó' },
      { from: '&amp;amp;#250;', to: 'ú' },
      { from: '&#241;', to: 'ñ' },
      { from: '&#209;', to: 'Ñ' },
      { from: '&amp;#209;', to: 'Ñ' },
      { from: '&#220;', to: 'Ü' },
      { from: '&#252;', to: 'ü' },
      { from: '&quot;', to: '' },
      { from: "'", to: '' },
    ];

    for (let replacement of replacements) {
      chain = chain.split(replacement.from).join(replacement.to);
    }

    return chain;
  }

  closeModalSubtype() {
    this.modalService.hide();
  }

  reset() {
    this.form.reset();
    this.formTwo.reset();
    this.formThree.reset();
    this.pnlControles = true;
  }

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
