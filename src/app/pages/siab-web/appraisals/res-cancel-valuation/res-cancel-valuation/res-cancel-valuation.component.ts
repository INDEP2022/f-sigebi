import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  MyBody,
  OfficesSend,
  SendObtainGoodValued,
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

  arrayResponseOffice: any[] = [];
  arrayResponseOfficeTwo: any[] = [];
  array: any[] = [];

  //Forms
  form: FormGroup;
  formTwo: FormGroup;
  formThree: FormGroup;

  // Select
  offices = new DefaultSelect();
  cityList = new DefaultSelect();
  sender = new DefaultSelect();
  usersList = new DefaultSelect();
  lsbConCopiaList: any[] = [];

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
  event: any;
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

  //Var Validation
  radioValueOne: boolean = false;
  redioValueTwo: boolean = false;
  pnlControles: boolean = true;
  pnlControles2: boolean = true;
  btnVerOficio: boolean = true;
  btnEnviar: boolean = true;
  btnModificar: boolean = true;
  btnGuardar: boolean = true;
  btnMotCan: boolean = true;
  byUser: boolean = false;

  // Modal #1
  formDialogOne: FormGroup;

  // Modal #2
  dataModal: LocalDataSource = new LocalDataSource();
  settingsModal: any;
  paramsModal = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsModal: number = 0;

  //Any
  fullUsers: any;
  fullCyties: any;

  //

  constructor(
    private fb: FormBuilder,
    private serviceJobs: JobsService,
    private cityService: CityService,
    private datePipe: DatePipe,
    private serviceAppraise: AppraiseService,
    private generateCveService: GenerateCveService,
    private route: ActivatedRoute,
    private router: Router
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
  }

  ngOnInit() {
    this.byUser = true;
    this.prepareForm();
    this.updateHour();
    this.intervalId = setInterval(() => {
      this.updateHour();
    }, 1000);
    this.setButtons(3);

    this.queryAllUsers();

    this.queryAllUsersTwo();

    this.queryCyties();

    this.route.queryParams.subscribe(params => {
      let body: OfficesSend = new OfficesSend();
      body.eventId = +params['event'];
      body.officeType = +params['type'];
      this.loadOffice(body.eventId, body.officeType);
    });
  }

  //

  getAddUser() {
    if (this.form.controls['user'].value) {
      let usuariocopia: string = '';
      let verificauser: boolean = false;
      if (this.lsbConCopiaList.length > 0) {
        for (const value of this.lsbConCopiaList) {
          usuariocopia = value.splint('-').toString();
          if (usuariocopia == this.form.controls['user'].value) {
            verificauser = true;
          }
        }
        if (verificauser != true) {
          this.lsbConCopiaList.push(this.form.controls['user'].value);
        }
      }
    } else {
      this.alert('warning', 'Debe Seleccionar un Usuario', '');
    }
  }

  getUsersDesList(event?: any) {}

  queryAllUsers(event?: any) {}

  queryAllUsersTwo(event?: any) {}

  queryCyties(event?: any) {}

  onRadioChange() {
    this.radioValueOne = true;
    if (this.event != '' && this.event != null) {
      this.btnMotCan = false;
      this.resetVariables();
      this.setButtons(3);
    } else {
      this.alert(
        'warning',
        'Advertencia',
        `Inserta un Evento Para Poder Continuar`
      );
    }
  }

  onRadioChangeTwo() {
    this.redioValueTwo = true;
    if (this.event != '' && this.event != null) {
      this.btnMotCan = false;
      this.resetVariables();
      this.setButtons(3);
    } else {
      this.alert(
        'warning',
        'Advertencia',
        `Inserta un Evento Para Poder Continuar`
      );
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
    this.arrayResponseOffice = [];
    this.form.reset();
    this.formTwo.reset();
    this.formDialogOne.reset();
    this.data = new LocalDataSource();
    this.dataTwo = new LocalDataSource();
    this.cityList = new DefaultSelect();
    this.columns = [];
    this.totalItems = 0;
    this.params.next(new ListParams());
    this.totalItemsTwo = 0;
    this.paramsTwo.next(new ListParams());
    this.dateNow = new Date();
    this.listCitys = null;
    this.listKeyOffice = null;
    this.settingsTwo = null;
    this.city = null;
    this.event = null;

    // Resetting validation variables
    this.pnlControles = false;
    this.pnlControles2 = false;
    this.btnVerOficio = false;
    this.btnEnviar = false;
    this.btnModificar = false;
    this.btnGuardar = false;
    this.getOffices();
    this.getCitiesList();
  }

  getCitiesList(params?: ListParams) {
    this.cityService.getAllCitysTwo(params).subscribe({
      next: resp => {
        this.cityList = new DefaultSelect(resp.data, resp.count);
      },
      error: eror => {
        this.loader.load = false;
        this.cityList = new DefaultSelect([], 0, true);
      },
    });
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
          this.cityList = new DefaultSelect([], 0, true);
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
      this.alert('warning', 'Advertencia', 'Problema Para Visualizar Oficio');
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

  getOfficeRequest(body: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.serviceJobs.postByFiltersResponse(body).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {
          reject(error);
        },
      });
    });
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
        this.event = i?.id_evento;

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
          this.radioValueOne = true;
          this.btnMotCan = false;
        } else if (type == 3) {
          this.obtainsValuedAssets(3, 0);
          this.redioValueTwo = true;
          this.btnMotCan = true;
        }
      }
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'No Existe Ninguna Solicitud de Oficio Para Este Evento. Verifique que se Haya Realizado la Solicitud Para Poder Continuar'
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
              this.radioValueOne = true;
              this.redioValueTwo = false;
            } else if (i?.tipo_oficio == 3) {
              this.radioValueOne = false;
              this.redioValueTwo = true;
            }
            this.loadOffice(
              this.form.controls['event'].value,
              this.returnOfOffice(),
              array.length
            );
            console.log('Este es el usuario de remitente.', i?.remitente);
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
      console.log('Lo que retorna el oficio: ', this.returnOfOffice());
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
      radioOne: [null],
      radioTwo: [null],
    });
    this.formTwo = this.fb.group({
      allGood: [null],
      selectedGood: [null],
    });
    this.formDialogOne = this.fb.group({
      noti: [null],
    });
    this.formThree = this.fb.group({
      byDel: [null],
      user: [null],
      del: [null],
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
    console.log(data);
    this.generateCveService.postSpUserAppraisal(data, params).subscribe({
      next: resp => {
        console.log(resp);
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
    console.log('Los datos de filtrado ', body);
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
            'No hay Bienes Para Realizar el Oficio de Respuesta'
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
            'No hay Bienes Para Realizar el Oficio de Cancelación'
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
    if (this.radioValueOne == true) {
      num = 2;
    } else if (this.redioValueTwo == true) {
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

  //Export and Import Excel
  exportExcel() {
    this.data.getAll().then(data => {
      import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, 'products');
      });
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  // Metodo del modal #2
  getReasonsChange() {
    let eventGlobal: number;
    eventGlobal = this.event;
    this.serviceJobs.getMoCanById(eventGlobal).subscribe({
      next: response => {
        console.log(
          'Esto trae la respuesta : ',
          response.data[0],
          ' y esto es el event : ',
          this.event
        );
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
    console.log('Esto es de la tabla del modal');
    this.selectedRows = event.selected; // Aquí, event.selected te dará todas las filas seleccionadas
  }

  onUserRowSelectCancel(event: any): void {
    console.log('Esto es de la tabla de abajo');
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
      console.log('Si entro aqui de verdad.');
      if (row.motivos == ' ') {
        row.motivos += motivos;
      }
    });

    // Actualiza la fuente de datos de la tabla si es necesario
    this.dataTwo.refresh();
  }
  //

  reasonsForChange() {
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
          'Para Continuar es Necesario Seleccionar Bienes'
        );
      }
    } else if (typeOffice == 3) {
      this.addReasons();
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para Continuar es Necesario Seleccionar Bienes'
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
          'Para Continuar es Necesario que Seleccione los Motivos por los Cuales se va a Enviar a REV el Bien'
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
          'Para Continuar es Necesario que Seleccione los Motivos por los Cuales se va a Enviar a REV el Bien'
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

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
