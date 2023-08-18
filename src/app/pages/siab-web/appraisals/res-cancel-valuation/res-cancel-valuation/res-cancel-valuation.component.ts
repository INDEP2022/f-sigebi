import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { OfficesSend } from '../../valuation-request/valuation-request/valuation-request.component';
import {
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
  VALUATION_REQUEST_COLUMNS_VALIDATED,
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
  form: FormGroup;
  formTwo: FormGroup;
  formDialogOne: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();
  offices = new DefaultSelect();
  cityList = new DefaultSelect();
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dateNow: Date;
  intervalId: any;
  listCitys: any;
  listKeyOffice: any;
  settingsTwo: any;
  subscribeDelete: Subscription;
  city: any;
  event: any;

  //Var asiggn
  lblTipoAccOficio: any = 'Hola Mundo';
  lbltipOficio: any = 'Hola Mundo';
  lblDireccion: any = 'Hola Mundo';
  lblCvlOfocio: any = 'Hola Mundo';

  //Var Validation
  radioValueOne: boolean = false;
  redioValueTwo: boolean = false;
  pnlControles: boolean = true;
  pnlControles2: boolean = false;
  btnVerOficio: boolean = false;
  btnEnviar: boolean = false;
  btnModificar: boolean = false;
  btnGuardar: boolean = false;
  btnMotCan: boolean = true;

  //

  constructor(
    private fb: FormBuilder,
    private serviceJobs: JobsService,
    private cityService: CityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };

    this.settingsTwo = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
    };
  }

  ngOnInit() {
    this.prepareForm();
    this.actualizarHora();
    this.intervalId = setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  //
  onRadioChange() {
    this.radioValueOne = true;
    console.log(
      'Es es el valor al que cambio el radio button: ',
      this.radioValueOne
    );
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
        console.log('Por aqui esta pasando: ', resp);
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
          console.log('Response de la ciudad que se busca: ', this.city);
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

  async getsContent() {
    // this.loader.load = true;
    // if (this.event == 0) {
    //   this.event = this.form.controls['event'].value;
    // }
    // let type = await this.getType(this.event);
    // console.log(type);
    // this.tipo = type;
  }

  findDataTable(data: any) {
    let valorObjeto: any;
    valorObjeto = data;
    let body: OfficesSend = new OfficesSend();
    body.eventId = valorObjeto?.eventId;
    body.officeType = valorObjeto?.jobType;
    this.serviceJobs.postByFilters(body).subscribe({
      next: response => {
        this.arrayResponseOffice = response.data;
        this.iterableAssign(this.arrayResponseOffice);
      },
      error: error => {},
    });
    this.serviceJobs.postByFiltersResponse(body).subscribe({
      next: response => {
        this.arrayResponseOfficeTwo = response.data;
        this.findPostData(this.arrayResponseOfficeTwo);
      },
      error: error => {},
    });
  }

  findPostData(array: any[]) {
    for (const i of array) {
      this.lblTipoAccOficio = i?.des_tipo_oficio.toUpperCase();
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
      this.lblCvlOfocio = '';
    }
  }

  actualizarHora(): void {
    this.dateNow = new Date();
  }

  async iterableAssign(array: any[]) {
    for (const i of array) {
      this.validateViewRadioButtonOne(i?.estatus_of);
      try {
        await this.getCityById(i?.ciudad);
        if (this.city) {
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
    }
  }

  validateViewRadioButtonOne(status: any) {
    if (status == 'ENVIADO') {
      this.pnlControles = false;
      this.pnlControles2 = false;
      this.setButtons(1);
      if (this.returnTypeOffice() == 2) {
        // grvBienesValuados.Columns[3] = false;
        this.settings = {
          ...this.settings,
          actions: false,
          columns: { ...VALUATION_REQUEST_COLUMNS_VALIDATED },
        };
      } else if (this.returnTypeOffice() == 3) {
        // grvBienesCacelar.Columns[3] = false;
        // grvBienesCacelar.Columns[6] = false;
      }
    }
  }

  returnTypeOffice(): number {
    let num: number = 0;
    return num;
  }

  setButtons(ac: number) {
    if (ac == 1) {
      this.btnVerOficio = true;
      this.btnEnviar = false;
      this.btnModificar = false;
      this.btnGuardar = false;
    } else if (ac == 3) {
      this.btnGuardar = true;
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
    this.subscribeDelete = this.form
      .get('office')
      .valueChanges.subscribe(value => {
        this.findDataTable(value);
      });
  }

  uploadService() {}

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
