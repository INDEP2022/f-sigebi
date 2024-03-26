import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  Subscription,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IModComerOffice } from 'src/app/core/models/ms-officemanagement/mod-comer-office';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ClarificationsService } from 'src/app/core/services/ms-office-management/clarifications.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnAddComponent } from 'src/app/shared/components/button-column/button-column-add.component';
import { ButtonColumnDeleteComponent } from 'src/app/shared/components/button-column/button-column-delete.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppraisalsDataService } from '../../appraisals-data.service';
import { CancelTableComponent } from './cancel-table/cancel-table.component';
import {
  MyBody,
  OfficesSend,
  SendObtainGoodValued,
  ValidationResponseFile,
} from './res-cancel-valuation-class/class-service';
import {
  goodCheck,
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
} from './res-cancel-valuation-columns';

interface IExcelToJson {
  ID_BIENES: number;
  ID_MOTIVOS1: number;
  MOTIVOS1: string;
  ID_MOTIVOS2: number;
  MOTIVOS2: string;
  ID_MOTIVOS3: number;
  MOTIVOS3: string;
  ID_MOTIVOS4: number;
  MOTIVOS4: string;
}
@Component({
  selector: 'app-res-cancel-valuation',
  templateUrl: './res-cancel-valuation.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class resCancelValuationComponent extends BasePage implements OnInit {
  //

  //#region Vars

  arrayResponseOfficeTwo: any[] = [];

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
  dateNow: Date;
  intervalId: any;
  listCitys: any;
  listKeyOffice: any;
  subscribeDelete: Subscription;
  city: any;
  rowCopySelect: any;
  varCount: number = 0;
  idOficio: any = 0;
  loadingTable1 = false;
  loadingTable2 = false;
  showModalCambioRev = 0;
  //Var Data Table
  // dataTwo: LocalDataSource = new LocalDataSource();
  nameExcel = '';
  elementsToExport: any[];
  loadingExcel = false;
  flagDownload = false;
  //Var asiggn
  lblTipoAccOficio: any = '-';
  lbltipOficio: any = '-';
  lblDireccion: any = '-';
  lblCvlOfocio: any = '-';
  statusOffice: any = '-';
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
  body1: SendObtainGoodValued = null;
  body2: SendObtainGoodValued = null;
  // Modal #1
  formDialogOne: FormGroup;

  dataGood: LocalDataSource = new LocalDataSource();
  dataGoodList: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings2 = {
    ...this.settings,
    hideSubHeader: false,
    actions: false,
    columns: VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
  };
  dataGood2: LocalDataSource = new LocalDataSource();
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  tipoOficio: number = 0;

  numOne: number;
  numTwo: number;
  m_comer: IModComerOffice;
  dataExcel: any = [];
  fileName: string;

  //#endregion

  //

  //#region Initialization
  constructor(
    private fb: FormBuilder,
    private serviceJobs: JobsService,
    private cityService: CityService,
    private datePipe: DatePipe,
    private dataService: AppraisalsDataService,
    private serviceAppraise: AppraiseService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private serviceDelegations: DelegationService,
    private serviceDepartments: DepartamentService,
    private jobDictumTextsService: JobDictumTextsService,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private clarificationsService: ClarificationsService,
    private parameterModService: ParameterModService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.columnsTable();
    this.prepareForm();
    this.form
      .get('event')
      .valueChanges.pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe({
        next: response => {
          console.log(response);
          if (response && this.form.get('radio').value) {
            this.tipoOficio = response;
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
          if (response && this.form.get('event').value) {
            this.tipoOficio = response;
            this.changeRatio(response);
          }
        },
      });
    this.m_comer = new IModComerOffice();
  }

  private changeRatio(radioValue: any) {
    console.log(this.event);
    if (this.event != '' && this.event != null) {
      this.btnMotCan = false;
      // this.resetVariables();
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
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.obtainsCancelAssets();
    });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.obtainsValuedAssets();
    });

    this.updateHour();
    this.intervalId = setInterval(() => {
      this.updateHour();
      let good = goodCheck.map(item => item.no_bien).join(',');
      console.log(good);
      this.formTwo.controls['selectedGood'].setValue(good);
    }, 1000);

    this.setButtons(3);

    // this.queryAllUsers();

    // this.queryAllUsersTwo();

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
    console.log(this.formThree.controls['user'].value);
    if (
      this.formThree.controls['user'].value == null &&
      this.formThree.controls['depar'].value == null
    ) {
      this.alert('warning', 'Debe seleccionar un usuario', '');
      return;
    } else {
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
  }

  removeUserCopy() {
    this.alertQuestion(
      'question',
      'Eliminar Usuario',
      '¿Desea eliminar un usuario?'
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

  get pathDest() {
    return 'security/api/v1/application/spUserAppraisal';
  }

  get bodyDest() {
    return {
      flagIn: 2,
    };
  }

  get bodyRemi() {
    return {
      flagIn: 1,
    };
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

  getCityById(id: any) {
    return this.cityService.getId(id).pipe(
      catchError(x => {
        this.fullCyties = new DefaultSelect([], 0, true);
        return of(null);
      }),
      tap(x => {
        if (x) {
          this.city = x;
          console.log(x);
        }
      })
    );
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
    // //
    let valorObjeto: any;
    valorObjeto = data;
    console.log(data);

    let body: any = {};
    body.eventId = valorObjeto?.eventId;
    body.officeId = valorObjeto?.jobType;
    // this.form
    //   .get('office')
    //   .setValue(data.jobId, { onlySelf: true, emitEvent: false });
    this.form
      .get('event')
      .setValue(valorObjeto?.eventId, { onlySelf: true, emitEvent: false });
    this.findOffice(body);
  }

  loadOffice(event: number, num: number, arrayLength?: number) {
    let body: OfficesSend = new OfficesSend();
    body.eventId = event;
    body.officeType = num ? num : 0;
    this.columnsTable();
    this.getOfficeResponse(body, num, arrayLength);
  }

  get officeType() {
    return this.form
      ? this.form.get('radio')
        ? this.form.get('radio').value
          ? this.form.get('radio').value
          : 0
        : 0
      : 0;
  }

  validateBienesSelect() {
    let tpOfi = this.officeType;
    if (tpOfi === 2) {
      if (goodCheck.length === 0) {
        this.alert(
          'warning',
          'Para continuar es necesario seleccionar bienes Valuados',
          ''
        );
        return false;
      }
    }
    if (tpOfi === 3) {
      if (goodCheck.length === 0) {
        this.alert(
          'warning',
          'Para continuar es necesario seleccionar bienes Cancelados',
          ''
        );
        return false;
      }
      let widthMotives = this.dataGoodList.filter(x => x.motivos);
      if (widthMotives.length != goodCheck.length.length) {
        this.alert(
          'warning',
          'Para continuar es necesario que seleccione los motivos por los que se enviara a Rev el bien',
          ''
        );
        return false;
      }
    }
    return true;
  }

  async modifyOffice() {
    try {
      if (!this.validateBienesSelect()) {
        return;
      }
      let tpOfi = this.officeType;
      console.log(tpOfi);
      let idOficio = 0;
      let dtidOfi: any = await this.insertaOficio();
      idOficio = dtidOfi.ID_OFICIO;
      let mensaje = dtidOfi.MSJ;
      if (idOficio == 0 && mensaje != null) {
        throw new Error(mensaje);
      }
      if (tpOfi == 2) {
        await this.insertaBien(idOficio, 0, 'D');
        for (let i = 0; i < goodCheck.length; i++) {
          await this.insertaBien(idOficio, goodCheck[i].no_bien, 'I');
        }
      } else if (tpOfi == 3) {
        await this.insertaBien(idOficio, 0, 'D');
        for (let i = 0; i < this.dataGoodList.length; i++) {
          await this.insertaMotRev(
            this.dataGoodList[i].no_bien,
            this.form.controls['event'].value,
            'NADA',
            'NADA',
            'D'
          );
        }
        for (let i = 0; i < goodCheck.length; i++) {
          this.dataGoodList.forEach(async element => {
            if (element.no_bien == goodCheck[i].no_bien) {
              await this.insertaMotRev(
                goodCheck[i].no_bien,
                this.form.controls['event'].value,
                this.changeChar(element.motivos.toString()),
                element.idMotivos.toString(),
                'I'
              );
              await this.insertaBien(idOficio, goodCheck[i].no_bien, 'I');
            }
          });
        }
      }
      this.arrayCopy.forEach(element => {
        this.postInsertUsuCopia('I', idOficio, element);
      });
      this.setButtons(4);
      this.alert('success', '', 'El oficio se actualizó correctamente');
    } catch (error) {
      this.alert('warning', '', 'Problema para actualizar el oficio');
    }
  }
  async postInsertUsuCopia(acction: string, mComer: any, value: any) {
    return new Promise(async (res, rej) => {
      let user = await this.obtenerTextoDespuesDelGuion(value);
      let data = {
        user: user,
        jobId: mComer,
        action: acction,
        userType: 'INTERNO',
      };

      this.usersService.postSpInsertWithcopyOfficia(data).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: eror => {
          this.loader.load = false;
          res(eror);
        },
      });
      // res(0);
    });
  }
  obtenerTextoDespuesDelGuion(texto): string {
    const partes = texto.split('-'); // Dividir el string en partes utilizando el guion como separador
    return partes.length > 1 ? partes[1].trim() : ''; // Seleccionar la segunda parte y eliminar espacios en blanco al principio y al final
  }
  private changeChar(chain: string): string {
    console.log(chain);
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

  async insertaOficio() {
    return new Promise((resolve, reject) => {
      let body = {
        TIPO_OFICIO_IN: this.m_comer.tipo_oficio,
        USUARIO_INSERT_IN: this.m_comer.usuario_insert,
        REMITENTE_IN: this.m_comer.remitente,
        DESTINATARIO_IN: this.m_comer.destinatario,
        CIUDAD_IN: this.m_comer.ciudad,
        TEXTO1_IN: this.m_comer.texto1,
        TEXTO2_IN: this.m_comer.texto2,
        TEXTO3_IN: this.m_comer.texto3,
        ID_OFICIO_IN: this.m_comer.id_oficio,
        ID_EVENTO_IN: this.m_comer.id_evento,
        ID_OFICIO_RES_IN: '',
        NUM_CV_ARMADA_IN: this.m_comer.num_cv_armada,
        ID_PROGRAMACION_IN:
          this.m_comer.id_programacion != null
            ? this.m_comer.id_programacion
            : null,
      };
      this.clarificationsService.postSpInsertaOficioRespuesta(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          reject(null);
        },
      });
    });
  }
  async insertaBien(idOficio: number, noBien: number, accion: string) {
    return new Promise((resolve, reject) => {
      let body = {
        jobId: idOficio,
        goodNumber: noBien,
        action: accion,
      };
      this.parameterModService.postSpInsertGoodRes(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  async insertaMotRev(
    noBien: number,
    idEvento: number,
    motivos: string,
    noMotivos: string,
    accion: string
  ) {
    return new Promise((resolve, reject) => {
      let body = {
        goodInNumber: noBien,
        eventInId: idEvento,
        reasonsInNumber: noMotivos,
        reasonsIn: motivos,
        actionIn: accion,
      };
      this.clarificationsService.postInsertReasonsRev(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  async viewOffice() {
    try {
      this.loader.load = true;
      let dataOffice: any[] = [];
      let type: ValidationResponseFile = new ValidationResponseFile();
      let body: OfficesSend = new OfficesSend();
      let myBody: MyBody = new MyBody();
      let tituloOficio: any;

      body.eventId = this.event;
      body.officeType = this.officeType;
      dataOffice = await this.getOfficeRequest(body);
      for (const x of dataOffice) {
        type.description = x.direccion;
        type.descriptionTypeOffice = x.des_tipo_oficio;
        type.typeOffice = x.id_tpsolaval;
        type.address = x.direccion;
      }
      console.log(type.typeOffice);
      if (type.typeOffice == 2) {
        console.log(this.form.get('radio').value);
        if (this.form.get('radio').value == 2) {
          tituloOficio = this.getDescriptionParameters('OFI_RES_V');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        } else if (this.form.get('radio').value == 3) {
          tituloOficio = this.getDescriptionParameters('OFI_CAN_V');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        }
      } else if (type.typeOffice == 1) {
        if (this.form.get('radio').value == 2) {
          tituloOficio = this.getDescriptionParameters('OFI_RES_A');
          myBody = await this.getDataByOffice();
          myBody.subject = tituloOficio;
          this.generateReport(myBody, type.address);
        } else if (this.form.get('radio').value == 3) {
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
    body.officeType = this.officeType;
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

    let noGood: any;
    noGood = await this.getGoodsWithOffice(this.returnIdOffice());
    console.log(noGood);
    let noGood2: any;
    noGood2 = await this.getGoodsWithOfficeAll(
      this.returnIdOffice(),
      noGood.count
    );

    for (const x of noGood2) {
      listGoods = listGoods + x.goodNumber.goodId + ', ';
    }
    console.log(listGoods);
    myBody.goodsList = listGoods;

    return myBody;
  }

  async getGoodsWithOffice(idOffice: number) {
    return new Promise((resolve, reject) => {
      let params = new ListParams();
      params['filter.jobId'] = idOffice;
      this.jobDictumTextsService.getcomerJobsDet(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  async getGoodsWithOfficeAll(idOffice: number, count: number) {
    return new Promise((resolve, reject) => {
      let params = new ListParams();
      params['filter.jobId'] = idOffice;
      params.limit = count;
      this.jobDictumTextsService.getcomerJobsDet(params).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  //No hay servicio en la documentacion
  // getGoodsWithOffice(idOffice: number) {
  //   let arrayNumGoods: any[] = [];
  //   let params = new ListParams();
  //   params['filter.jobId'] = idOffice;
  //   this.jobDictumTextsService.getcomerJobsDet(params).subscribe({
  //     next: response => {
  //       console.log(response);
  //       arrayNumGoods = response.data;
  //       console.log(arrayNumGoods);
  //       return arrayNumGoods;
  //     },
  //     error: error => {
  //       arrayNumGoods = [];
  //       return arrayNumGoods;
  //     },
  //   });
  // }

  generateReport(myBody: MyBody, address: any) {
    console.log(myBody);
    console.log(address);
    this.loader.load = false;
    let params = {};
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loader.load = false;
      } else {
        this.onLoadToast('warning', 'advertencia', '');
        this.loader.load = false;
      }
    });
  }

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
    console.log(type);
    let array = [];
    array = await this.getOfficeRequest(body);
    console.log(array);
    if (array.length > 0) {
      for (const i of array) {
        this.lblTipoAccOficio = i
          ? i.des_tipo_oficio
            ? String(i.des_tipo_oficio).toUpperCase()
            : ''
          : '';
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

        this.form
          .get('event')
          .setValue(i?.id_evento, { onlySelf: true, emitEvent: false });
        this.form.controls['dateRec'].setValue(this.dateFormat(i?.fecha_envia));
        this.form.controls['dateEla'].setValue(
          this.dateFormat(i?.fecha_insert)
        );
        this.form.controls['ref'].setValue(
          i?.referen + ' ' + this.lblDireccion
        );
        this.form.controls['aten'].setValue(
          i?.atencion + ' ' + this.lblCvlOfocio
        );
        if (i.fol) {
          this.form.controls['fol'].setValue(i.fol);
        }
      }
      if (type == 2) {
        this.obtainsValuedAssets(2, 0);
        // this.radioValueOne = true;
        this.form
          .get('radio')
          .setValue('2', { onlySelf: true, emitEvent: false });
        this.btnMotCan = true;
      } else if (type == 3) {
        this.obtainsCancelAssets(3, 0);
        this.form
          .get('radio')
          .setValue('3', { onlySelf: true, emitEvent: false });
        // this.redioValueTwo = true;
        this.settings = {
          ...this.settings,
          hideSubHeader: false,
          actions: false,
          columns: VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
        };
        this.btnMotCan = false;
      }
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'No existe ninguna solicitud de oficio para este evento. verifique que se haya realizado la solicitud para poder continuar'
      );
    }
  }

  async findOffice(body: any) {
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.totalItems = 0;
    this.dataGood2.load([]);
    this.dataGood2.refresh;
    this.totalItems2 = 0;
    this.idOficio = this.form.controls['office'].value?.jobId;
    this.form.patchValue({
      dest: null,
      key: null,
      remi: null,
      cityCi: null,
      ref: null,
      aten: null,
      espe: null,
      fol: null,
      radio: null,
    });
    console.log(this.idOficio);

    // //
    if (this.idOficio > 0) {
      let array = await this.getOfficeResponseTwo(body);
      console.log(array);
      let statusOffice: string;
      for (const [index, i] of array.entries()) {
        await firstValueFrom(this.getCityById(i?.ciudad));
        console.log(this.city);
        if (this.city) {
          if (i?.tipo_oficio == 2) {
            this.form
              .get('radio')
              .setValue('2', { onlySelf: true, emitEvent: false });
          } else if (i?.tipo_oficio == 3) {
            this.form
              .get('radio')
              .setValue('3', { onlySelf: true, emitEvent: false });
          }
          if (index === array.length - 1) {
            await this.loadOffice(body.eventId, body.officeId, array.length);
          }
          console.log(i);
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
        this.tipoOficio = i?.tipo_oficio;
        statusOffice = i?.estatus_of;
        this.statusOffice = i?.estatus_of;
        this.m_comer = i;
      }
      this.validateFindOfficeOne(statusOffice);
    } else {
      this.setButtons(3);
      this.resetVariables();
      this.pnlControles = true;
      console.log(this.pnlControles);
      this.pnlControles2 = true;

      if (this.form.get('radio').value == 2) {
        this.obtainsValuedAssets(4, this.idOficio);
        this.btnMotCan = true;
      } else if (this.form.get('radio').value == 3) {
        this.obtainsCancelAssets(5, this.idOficio);
        this.btnMotCan = false;
      }
    }
    //Marca Bienes
  }

  validateFindOfficeOne(status: any) {
    // //
    if (status == 'ENVIADO') {
      // this.pnlControles = false;
      console.log(this.pnlControles);
      this.pnlControles2 = false;
      this.setButtons(1);
      if (this.form.get('radio').value == 2) {
        this.settings = {
          ...this.settings,
          hideSubHeader: false,
          actions: false,
          columns: VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
        };
      } else if (this.form.get('radio').value == 3) {
        this.settings = {
          ...this.settings,
          hideSubHeader: false,
          actions: false,
          columns: VALUATION_REQUEST_COLUMNS_VALIDATED_TWO,
        };
      }
    } else {
      this.pnlControles = true;

      this.pnlControles2 = true;
      this.setButtons(2);
      if (this.form.get('radio').value == 2) {
      } else if (this.form.get('radio').value == 3) {
      }
    }
    console.log(this.form.get('radio').value);

    this.idOficio = this.form.controls['office'].value?.jobId;
    if (this.form.get('radio').value == 2) {
      this.obtainsValuedAssets(4, this.idOficio);
      this.btnMotCan = true;
    } else if (this.form.get('radio').value == 3) {
      this.obtainsCancelAssets(5, this.idOficio);
      this.btnMotCan = false;
    }
    setTimeout(() => {
      // this.marcaBienes(this.idOficio);
    }, 3000);
  }
  async marcaBienes(idOficio: number) {
    console.log(idOficio);
    var goodOficio;
    goodOficio = await this.getGoodsWithOffice(idOficio);

    for (const row of goodOficio.data) {
      console.log(row.goodNumber.id);
      var no_bien = row.goodNumber.id;
      console.log(this.dataGoodList);
      if (this.form.get('radio').value == 2) {
        for (let i = 0; i < this.dataGoodList.length; i++) {
          if (this.dataGoodList[0].no_bien == no_bien) {
            console.log(this.dataGoodList[0]);
          }
        }
      } else if (this.form.get('radio').value == 3) {
        for (let i = 0; i < this.dataGoodList.length; i++) {
          if (this.dataGoodList[0].no_bien == no_bien) {
            console.log(this.dataGoodList[0]);
          }
        }
      }
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
      event: [null, Validators.required],
      cveService: [null],
      fol: [null, Validators.required],
      key: [null],
      cityCi: [null, Validators.required],
      dateRec: [null],
      dateEla: [null],
      remi: [null, Validators.required],
      dest: [null, Validators.required],
      office: [null],
      ref: [null],
      aten: [null],
      espe: [null],
      radio: [null],
    });
    this.formTwo = this.fb.group({
      allGood: [0],
      selectedGood: [0],
      file: [null],
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
    this.formTwo.get('allGood').disable();
    this.formTwo.get('selectedGood').disable();
    this.subscribeDelete = this.form
      .get('office')
      .valueChanges.subscribe(value => {
        this.findOfficeService(value);
      });
  }
  columnsTable() {
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...VALUATION_REQUEST_COLUMNS,
        agregarMotivos: {
          title: 'Agregar Motivo(s)',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnAddComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              let event = row.id_evento;
              let officeType = this.officeType;
              let config: ModalOptions = {
                initialState: {
                  event,
                  officeType,
                  callback: (next: any) => {
                    if (next) {
                      console.log(next);

                      let motive = next
                        .map(item => item.descripcion_motivo)
                        .join(',');
                      let idMotive = next.map(item => item.id_motivo).join(',');
                      this.dataGood2.getElements().then(_item => {
                        let result = _item.map(item => {
                          if (item.no_bien == row.no_bien) {
                            item.motivos = motive;
                            item.idMotivos = idMotive;
                          }
                        });
                        Promise.all(result).then(resp => {
                          this.dataGood2.refresh();
                        });
                      });
                      this.dataGood.getElements().then(_item => {
                        let result = _item.map(item => {
                          if (item.no_bien == row.no_bien) {
                            item.motivos = motive;
                            item.idMotivos = idMotive;
                          }
                        });
                        Promise.all(result).then(resp => {
                          this.dataGood.refresh();
                        });
                      });
                      this.dataGoodList.forEach(item => {
                        if (item.no_bien == row.no_bien) {
                          item.motivos = motive;
                          item.idMotivos = idMotive;
                        }
                      });
                    }
                  },
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(CancelTableComponent, config);
            });
          },
        },
        motivosQ: {
          title: 'Quitar Motivo(s)',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnDeleteComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.dataGood2.getElements().then(_item => {
                let result = _item.map(item => {
                  if (item.no_bien == row.no_bien) {
                    item.motivos = '';
                    item.idMotivos = '';
                  }
                });
                Promise.all(result).then(resp => {
                  this.dataGood2.refresh();
                });
              });
              this.dataGood.getElements().then(_item => {
                let result = _item.map(item => {
                  if (item.no_bien == row.no_bien) {
                    item.motivos = '';
                    item.idMotivos = '';
                  }
                });
                Promise.all(result).then(resp => {
                  this.dataGood.refresh();
                });
              });
              this.dataGoodList.forEach(item => {
                if (item.no_bien == row.no_bien) {
                  item.motivos = '';
                  item.idMotivos = '';
                }
              });
            });
          },
        },
      },
    };
  }
  obtainsValuedAssets(numOne?: number, numTwo?: number) {
    let data;

    if (numOne != null && numTwo != null) {
      this.numOne = numOne;
      this.numTwo = numTwo;
      this.body2 = { idEventIn: this.event, tpJobIn: numOne, idJobIn: numTwo };
      console.log(this.body2);
      this.loading = true;
      data = {
        idEventIn: this.event,
        tpJobIn: numOne,
        idJobIn: numTwo,
      };
    } else {
      this.loading = true;
      data = {
        idEventIn: this.event,
        tpJobIn: this.numOne,
        idJobIn: this.numTwo,
      };
    }
    this.params.getValue()['sortBy'] = 'descripcion:ASC';
    let params = {
      ...this.params.getValue(),
    };
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.totalItems = 0;
    this.dataGoodList = [];
    this.serviceAppraise.postGetAppraise(data, params).subscribe({
      next: response => {
        console.log(response);
        if (this.dataGoodList.length > 9) {
          this.dataGoodList.push(response.data);
        } else if (this.dataGoodList.length == 0) {
          this.dataGoodList = response.data;
        }

        this.dataGood.load(response.data);
        this.dataGood.refresh();
        this.totalItems = response.count;
        this.formTwo.controls['allGood'].setValue(response.count);
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.dataGood.load([]);
        this.dataGood.refresh();
        this.totalItems = 0;
        this.formTwo.controls['allGood'].setValue(0);
        this.loading = false;
      },
    });
  }

  obtainsCancelAssets(numOne?: number, numTwo?: number) {
    let data;
    if (numOne != null && numTwo != null) {
      this.numOne = numOne;
      this.numTwo = numTwo;
      this.body2 = { idEventIn: this.event, tpJobIn: numOne, idJobIn: numTwo };
      console.log(this.body2);
      this.loading = true;
      data = {
        idEventIn: this.event,
        tpJobIn: numOne,
        idJobIn: numTwo,
      };
    } else {
      this.loading = true;
      data = {
        idEventIn: this.event,
        tpJobIn: this.numOne,
        idJobIn: this.numTwo,
      };
    }
    this.params.getValue()['sortBy'] = 'descripcion:ASC';
    let params = {
      ...this.params2.getValue(),
    };
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.totalItems = 0;
    this.dataGoodList = [];
    this.serviceAppraise.postGetAppraise(data, params).subscribe({
      next: response => {
        console.log(response);
        if (params.page > 2) {
          this.dataGoodList.push(response.data);
        } else {
          this.dataGoodList = response.data;
        }
        console.log(this.dataGoodList);
        this.dataGood2.load(response.data);
        this.dataGood2.refresh();
        this.totalItems2 = response.count;
        this.formTwo.controls['allGood'].setValue(response.count);
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.dataGood2.load([]);
        this.dataGood2.refresh();
        this.totalItems2 = 0;
        this.formTwo.controls['allGood'].setValue(0);
        this.loading = false;
      },
    });
  }

  updateHour(): void {
    this.dateNow = new Date();
  }

  dateFormat(date: any) {
    let dateLocal: any;
    dateLocal = this.datePipe.transform(date, 'dd/MM/yyyy');
    return dateLocal;
  }

  get cancelData() {
    return this.dataService.cancelsData;
  }

  get valuedData() {
    return this.dataService.valuedsData;
  }

  get selectedRowsCancel() {
    return this.dataService.selectedRowsCancel;
  }

  get selectedRowsValueds() {
    return this.dataService.selectedRowsValues;
  }

  //#region Excel
  //Export and Import Excel
  exportExcel() {
    // //

    let params = {
      ...this.params2.getValue(),
    };
    this.loader.load = true;
    this.serviceAppraise
      .postGetAppraise(this.body2, { ...params, limit: 100000000 })
      .subscribe({
        next: resp => {
          console.log(resp);
          if (resp && resp.data && resp.data.length > 0) {
            let bienesArray = [];
            bienesArray = resp.data.map((row: any) => {
              return { ...row };
            });

            let params = new ListParams();
            this.serviceJobs
              .getMoCanById(this.event, {
                ...params,
                limit: 100000000,
                sortBy: 'descripcion:ASC',
              })
              .subscribe({
                next: response => {
                  console.log(response);
                  this.nameExcel = 'Motivos REV';
                  this.elementsToExport = response.data[0].map((x: any) => {
                    let newRow1: any = {
                      ID_MOTIVOS: x.id_motivo,
                      MOTIVOS: x.descripcion_motivo,
                    };
                    return newRow1;
                  });
                  const filename: string = this.nameExcel;

                  bienesArray = resp.data.map((x: any) => {
                    let newRow: any = {
                      ID_BIENES: x.no_bien,
                      ID_MOTIVO1: '',
                      MOTIVOS1: '',
                      ID_MOTIVO2: '',
                      MOTIVOS2: '',
                      ID_MOTIVO3: '',
                      MOTIVOS3: '',
                      ID_MOTIVO4: '',
                      MOTIVOS4: '',
                    };
                    return newRow;
                  });
                  const filename1: string = 'Bienes';
                  const filename2: string = 'RespuestaAvaluo';
                  this.excelService.exportTwo(
                    bienesArray,
                    this.elementsToExport,
                    {
                      type: 'xlsx',
                      filename1,
                      filename,
                      filename2,
                    }
                  );
                  this.loader.load = false;
                },
                error: error => {
                  this.loader.load = false;
                },
              });
          } else {
            this.loader.load = false;
            this.alert('warning', 'Sin bienes para descargar', '');
          }
        },
        error: error => {
          if (error.status == 400) {
            this.loader.load = false;
            this.alert('warning', 'Sin bienes para descargar', '');
            // this.alert(
            //   'warning',
            //   'Advertencia',
            //   'No hay bienes para realizar el oficio de respuesta'
            // );
          }
        },
      });
  }

  private validateSelectes(array: any[]) {
    if (array.length === 0) {
      this.alert(
        'warning',
        'Para continuar es necesario seleccionar bienes',
        ''
      );
      return false;
    }
    for (let x of array) {
      if (!x.motivos) {
        this.alert(
          'warning',
          'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien',
          ''
        );
        return false;
      }
      if (x.motivos) {
        if (x.motivos.trim() === '') {
          this.alert(
            'warning',
            'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien',
            ''
          );
          return false;
        }
      }
    }
    return true;
  }

  async save() {
    try {
      if (this.fol.value == null) {
        console.log(this.fol.value);
        this.alert('warning', 'Es necesario capturar el folio', '');
        return;
      }
      let tpOfi = this.officeType;
      console.log(tpOfi);

      let idOficio = 0;
      let bienesTotales = 0;
      if (
        (tpOfi === 3 || tpOfi === 2) &&
        !this.validateSelectes(
          tpOfi === 3 ? this.selectedRowsCancel : this.selectedRowsValueds
        )
      ) {
        return;
      }
      let dtidOfi: any = await this.insertaOficio();
      console.log(dtidOfi);
      // dtidOfi.forEach(element => {
      idOficio = dtidOfi.ID_OFICIO;
      let mensaje = dtidOfi.MSJ;
      if (idOficio == 0 && mensaje != null) {
        throw new Error(mensaje);
      }
      // });
      if (tpOfi == 2) {
        await this.insertaBien(idOficio, 0, 'D');
        for (let i = 0; i < goodCheck.length; i++) {
          await this.insertaBien(idOficio, goodCheck[i].no_bien, 'I');
        }
      } else if (tpOfi == 3) {
        console.log(this.dataGoodList);
        console.log(goodCheck);
        for (let i = 0; i < goodCheck.length; i++) {
          this.dataGoodList.forEach(async element => {
            console.log(element.no_bien);
            console.log(goodCheck[i].no_bien);

            if (element.no_bien == goodCheck[i].no_bien) {
              console.log(element.motivos);
              await this.insertaMotRev(
                goodCheck[i].no_bien,
                this.form.controls['event'].value,
                this.changeChar(element.motivos),
                element.idMotivos.toString(),
                'I'
              );
              await this.insertaBien(idOficio, goodCheck[i].no_bien, 'I');
              bienesTotales++;
            }
          });
        }
      }

      this.arrayCopy.forEach(element => {
        this.postInsertUsuCopia('I', idOficio, element);
      });
      this.setButtons(2);
      this.alert('success', '', 'El oficio se guardó correctamente');
      // add setButtons(2) edit setButtons(4)
    } catch (error) {
      this.alert('warning', '', 'Problema para guardar el oficio' + error);
    }
  }

  get fol() {
    return this.form.get('fol');
  }

  showModal() {
    this.showModalCambioRev++;
  }
  senders() {
    this.alertQuestion(
      'question',
      'Una vez que el oficio sea enviado no se podrá realizar ninguna modificación.',
      '¿Está seguro que desea continuar?'
    ).then(async x => {
      if (x.isConfirmed) {
        if (this.event && this.event != null) {
          await this.actualizarEstatus(
            this.event,
            this.returnIdOffice(),
            this.formThree.controls['user'].value
          );
          this.reset();
          this.setButtons(5);
          this.alert('success', '', 'El oficio fue enviado exitosamente');
        }
      }
    });
  }
  async actualizarEstatus(idEvento: number, oficio: number, usuario: string) {
    return new Promise((resolve, reject) => {
      let body = {
        id_evento_in: idEvento,
        id_oficio_in: oficio,
        usuario_envia_in: usuario,
        pc_no_bien: 0,
      };
      this.clarificationsService.postGetSpEnviaRespuestaOficio(body).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }
  reset() {
    this.form.reset({}, { onlySelf: true, emitEvent: false });
    this.formTwo.reset({}, { onlySelf: true, emitEvent: false });
    this.formThree.reset({}, { onlySelf: true, emitEvent: false });
    this.lblTipoAccOficio = '-';
    this.lbltipOficio = '-';
    this.lblDireccion = '-';
    this.lblCvlOfocio = '-';
    this.pnlControles = true;
    this.body1 = null;
    this.body2 = null;
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.dataGood2.load([]);
    this.dataGood2.refresh();
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.setButtons(3);
  }

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }

  chargeFile(event: Event) {
    try {
      const files = (event.target as HTMLInputElement).files;

      if (!files || files.length !== 1)
        throw new Error('Please select one file.');
      this.fileName = files[0].name;
      console.log(this.fileName);
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(files[0]);
      fileReader.onload = () => this.readExcel(fileReader.result);

      // Lee el contenido binario del archivo
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      this.dataExcel.forEach(element => {
        this.dataGood2.getElements().then(_item => {
          let result = _item.map(item => {
            if (item.no_bien == element.ID_BIENES) {
              item.motivos =
                (element.MOTIVOS1 ? `${element.MOTIVOS1},` : '') +
                (element.MOTIVOS2 ? `${element.MOTIVOS2},` : '') +
                (element.MOTIVOS3 ? `${element.MOTIVOS3},` : '') +
                `${element.MOTIVOS4}`;
              item.idMotivos =
                (element.ID_MOTIVO1 ? `${element.ID_MOTIVO2},` : '') +
                (element.ID_MOTIVO2 ? `${element.ID_MOTIVO2},` : '') +
                (element.ID_MOTIVO3 ? `${element.ID_MOTIVO3},` : '') +
                `${element.ID_MOTIVO4}`;
            }
          });
          Promise.all(result).then(resp => {
            this.dataGood2.refresh();
          });
        });
        this.dataGood.getElements().then(_item => {
          let result = _item.map(item => {
            if (item.no_bien == element.ID_BIENES) {
              item.motivos =
                (element.MOTIVOS1 ? `${element.MOTIVOS1},` : '') +
                (element.MOTIVOS2 ? `${element.MOTIVOS2},` : '') +
                (element.MOTIVOS3 ? `${element.MOTIVOS3},` : '') +
                `${element.MOTIVOS4}`;
              item.idMotivos =
                (element.ID_MOTIVO1 ? `${element.ID_MOTIVO2},` : '') +
                (element.ID_MOTIVO2 ? `${element.ID_MOTIVO2},` : '') +
                (element.ID_MOTIVO3 ? `${element.ID_MOTIVO3},` : '') +
                `${element.ID_MOTIVO4}`;
            }
          });
          Promise.all(result).then(resp => {
            this.dataGood.refresh();
          });
        });
        this.dataGoodList.forEach(item => {
          if (item.no_bien == element.ID_BIENES) {
            item.motivos =
              (element.MOTIVOS1 ? `${element.MOTIVOS1},` : '') +
              (element.MOTIVOS2 ? `${element.MOTIVOS2},` : '') +
              (element.MOTIVOS3 ? `${element.MOTIVOS3},` : '') +
              `${element.MOTIVOS4}`;
            item.idMotivos =
              (element.ID_MOTIVO1 ? `${element.ID_MOTIVO2},` : '') +
              (element.ID_MOTIVO2 ? `${element.ID_MOTIVO2},` : '') +
              (element.ID_MOTIVO3 ? `${element.ID_MOTIVO3},` : '') +
              `${element.ID_MOTIVO4}`;
          }
        });
      });
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo' + error);
    }
  }
}
