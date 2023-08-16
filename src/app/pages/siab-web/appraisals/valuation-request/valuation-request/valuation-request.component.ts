import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
} from './valuation-request-columns';

export class OfficesSend {
  eventId: number;
  officeType: number;
}

@Component({
  selector: 'app-valuation-request',
  templateUrl: './valuation-request.component.html',
  styles: [],
})
export class valuationRequestComponent extends BasePage implements OnInit {
  arrayResponseOffice: any[] = [];
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
  }

  actualizarHora(): void {
    this.dateNow = new Date();
  }

  iterableAssign(array: any[]) {
    let city: any;
    for (const i of array) {
      console.log('El objeto completo en cada busqueda: ', i);
      console.log(
        'Aqui ya se esta trabajando con la ciudad que se obtuvo: ',
        this.city
      );
      this.form.patchValue({
        dest: i?.destinatario,
        key: i?.cve_oficio,
        remi: i?.remitente,
        cityCi: this.city,
        ref: i?.texto1,
        aten: i?.texto2,
        espe: i?.texto3,
        fol: i?.num_cv_armada,
      });
    }
  }

  getOffices(event: any) {
    this.serviceJobs.getAll(event).subscribe({
      next: data => {
        this.offices = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.offices = new DefaultSelect();
      },
    });
  }

  getCitiesList(params: ListParams) {
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

  getCityById(id: any) {
    let data: any;
    this.cityService.getId(id).subscribe({
      next: response => {
        this.city = response;
        console.log('La respuesta pero sin asignar aun: ', response);
        console.log('Response de la ciudad que se busca: ', this.city);
      },
      error: error => {
        this.loader.load = false;
        this.cityList = new DefaultSelect([], 0, true);
      },
    });
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

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
