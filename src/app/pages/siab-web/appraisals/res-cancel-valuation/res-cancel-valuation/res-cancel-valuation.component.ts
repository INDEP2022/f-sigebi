import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { OfficesSend } from '../../valuation-request/valuation-request/valuation-request.component';
import {
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
} from './res-cancel-valuation-columns';

export class SendObtainGoodValued {
  idEventIn: any;
  tpJobIn: any;
  idJobIn: any;
}

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
  form: FormGroup;
  formTwo: FormGroup;
  formDialogOne: FormGroup;
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
  varCount: number = 0;

  //Var Data Table
  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();

  //Var asiggn
  lblTipoAccOficio: any = '-';
  lbltipOficio: any = '-';
  lblDireccion: any = '-';
  lblCvlOfocio: any = '-';

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
    private cityService: CityService,
    private datePipe: DatePipe,
    private serviceAppraise: AppraiseService
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
    this.updateHour();
    this.intervalId = setInterval(() => {
      this.updateHour();
    }, 1000);
  }

  //
  onRadioChange() {
    this.radioValueOne = true;
    // console.log(
    //   'Es es el valor al que cambio el radio button: ',
    //   this.radioValueOne
    // );
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
    // console.log(
    //   'Es es el valor al que cambio el radio button: ',
    //   this.redioValueTwo
    // );
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
        // console.log('Por aqui esta pasando: ', resp);
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
          // console.log('Response de la ciudad que se busca: ', this.city);
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

  findOfficeService(data: any) {
    let valorObjeto: any;
    valorObjeto = data;
    let body: OfficesSend = new OfficesSend();
    body.eventId = valorObjeto?.eventId;
    body.officeType = valorObjeto?.jobType;
    this.serviceJobs.postByFilters(body).subscribe({
      next: response => {
        this.arrayResponseOffice = response.data;
        this.findOffice(this.arrayResponseOffice);
      },
      error: error => {
        this.alert('error', 'Error', 'Ha Ocurrido un Error');
      },
    });
    // this.serviceJobs.postByFiltersResponse(body).subscribe({
    //   next: response => {
    //     this.arrayResponseOfficeTwo = response.data;
    //     this.findPostData(this.arrayResponseOfficeTwo);
    //   },
    //   error: error => { },
    // });
  }

  loadOffice(event: number, num: number, arrayLength: number) {
    let body: OfficesSend = new OfficesSend();
    body.eventId = event;
    body.officeType = num;
    this.getOfficeResponse(body, num, arrayLength);
  }

  getOfficeResponse(body: any, type: number, arrayLength: number) {
    this.serviceJobs.postByFiltersResponse(body).subscribe({
      next: response => {
        this.array = response.data;
        for (const i of this.array) {
          console.log('Dentro del arreglo: ', this.array);
          console.log('Este es el indice actual: ', i);
          this.lblTipoAccOficio = String(i?.des_tipo_oficio).toUpperCase();
          if (i?.tipo == 'VALOR') {
            this.lbltipOficio = ' DE REFERENCIA DE ' + i?.tipo;
          } else if (i?.tipo == 'AVALUO') {
            console.log('Si es de avaluo');
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

          this.form.controls['dateRec'].setValue(
            this.dateFormat(i?.fecha_envia)
          );
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
          } else if (type == 3) {
            this.obtainsValuedAssets(3, 0);
            this.redioValueTwo = true;
          }
        }
      },
      error: error => {
        if (error.status == 400) {
          this.varCount++;
          if (this.varCount == arrayLength) {
            this.alert(
              'warning',
              'Advertencia',
              'No Existe Ninguna Solicitud de Oficio Para Este Evento. Verifique que se Haya Realizado la Solicitud Para Poder Continuar'
            );
          }
        } else {
          this.alert('error', 'Error', 'Ha Ocurrido un Error');
        }
      },
    });
  }

  async findOffice(array: any[]) {
    for (const i of array) {
      this.validateViewRadioButtonOne(i?.estatus_of);
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
          console.log('Primero se asigna aca abajo');
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
    // if (status == 'ENVIADO') {
    //   this.pnlControles = false;
    //   this.pnlControles2 = false;
    //   this.setButtons(1);
    //   if (this.returnTypeOffice() == 2) {
    //     // grvBienesValuados.Columns[3] = false;
    //     this.settings = {
    //       ...this.settings,
    //       actions: false,
    //       columns: { ...VALUATION_REQUEST_COLUMNS_VALIDATED },
    //     };
    //   } else if (this.returnTypeOffice() == 3) {
    //     // grvBienesCacelar.Columns[3] = false;
    //     // grvBienesCacelar.Columns[6] = false;
    //   }
    // }
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
        this.findOfficeService(value);
      });
  }

  obtainsValuedAssets(numOne: number, numTwo: number) {
    let body: SendObtainGoodValued;
    body.idEventIn = this.event;
    body.idJobIn = numOne;
    body.tpJobIn = numTwo;
    this.serviceAppraise.postGetAppraise(body).subscribe({
      next: response => {
        console.log('Esta es la respuesta con los datos: ', response.data);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => {
        if (error.status == 400) {
          this.alert(
            'warning',
            'Advertencia',
            'No Existe Ninguna Solicitud de Oficio Para Este Evento. Verifique que se Haya Realizado la Solicitud Para Poder Continuar'
          );
        }
        this.loader.load = false;
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
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

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
