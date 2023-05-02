import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BILLS_COLUMNS } from './bills-columns';
import { DISPERSION_COLUMNS } from './dispersion-columns';

@Component({
  selector: 'app-numeraire-conversion-auctions',
  templateUrl: './numeraire-conversion-auctions.component.html',
  styles: [],
})
export class NumeraireConversionAuctionsComponent
  extends BasePage
  implements OnInit
{
  settings2 = {
    ...this.settings,
    actions: false,
  };

  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedEvent: any = null;
  eventItems = new DefaultSelect();
  showDisperstion = false;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...BILLS_COLUMNS },
    };

    this.settings2.columns = DISPERSION_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvents({ page: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: ['', [Validators.required]],
      // cveEvent: ['', [Validators.required]],
      // nameEvent: ['', [Validators.required]],
      // obsEvent: ['', [Validators.required]],
      // place: ['', [Validators.required]],
      // eventDate: ['', [Validators.required]],
      // failureDate: ['', [Validators.required]],
    });
  }

  //Datos de las tablas
  data1 = [
    {
      idGasto: '159',
      descrIdGasto: 'Gastos 159',
      monto: ' 132564',
      solPago: '147',
      mandato: 'mandato 1',
      total: '132711',
    },
  ];
  data2 = [
    {
      noBien: '147',
      monto: '7894',
      partConver: 'mxn',
      solPago: '147',
      fecha: '31-05-2020',
    },
  ];

  //Datos de prueba para autorrellenar los campos
  data: any = [
    {
      idEvent: 1,
      nameEvent: 'SUBASTA',
      cveEvent: 'DECBM 01/07',
      obsEvent: 'SI ESTOY ENTRANDO 3M',
      place: 'TOLUCA',
      eventDate: '19-05-2021',
      failureDate: '01-07-2022',
    },
    {
      idEvent: 2,
      nameEvent: 'PREPARACIÓN',
      cveEvent: 'SEBM0107 SEV0107',
      obsEvent: 'SI ESTOY ENTRANDO 2 4',
      place: 'VERACRUZ',
      eventDate: '10-05-2018',
      failureDate: '10-05-2020',
    },
    {
      idEvent: 3,
      nameEvent: 'REMESAS',
      cveEvent: 'SEBM0207 Y SEV020',
      obsEvent: 'SI ESTOY ENTRANDO 4M',
      place: 'CDMX',
      eventDate: '14-01-2011',
      failureDate: '04-10-2014',
    },
  ];

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
  }
}
