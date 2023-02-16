import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ProceedingsDeliveryReceptionTsService } from './../../../core/services/ms-proceedings/proceedings-delivery-reception.ts.service';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: ['scheduled-maintenance.scss'],
})
export class ScheduledMaintenanceComponent extends BasePage implements OnInit {
  itemsSelect = new DefaultSelect();
  form: FormGroup;
  settings1 = {
    ...TABLE_SETTINGS,
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      progRecepcionEntrega: {
        title: 'Programa Recepcion Entrega',
        type: 'string',
        sort: false,
      },
      Fechacaptura: {
        title: 'Fecha Captura',
        type: Date,
        sort: false,
      },
      ingreso: {
        title: 'Ingreso',
        type: 'string',
        sort: false,
      },
      estatusEvento: {
        title: 'Estatus Evento',
        type: 'number',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  statusList = [
    { id: 0, description: 'Abierto' },
    { id: 1, description: 'Cerrado' },
    { id: 2, description: 'Todos' },
  ];
  statusEvent = new DefaultSelect(this.statusList, 3);
  data = EXAMPLE_DATA;
  constructor(
    private fb: FormBuilder,
    private proceedingService: ProceedingsDeliveryReceptionTsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.proceedingService.getAll(new ListParams()).subscribe(x => {
    //   console.log(x);
    // });
    // this.getStatus();
  }

  getStatus(event: any) {
    console.log(event);
    this.statusEvent = new DefaultSelect(
      this.statusList.filter(status =>
        status.description.toLowerCase().trim().includes(event.text)
      )
    );
  }

  onEventsChange(type: any) {
    this.form.updateValueAndValidity();
    // this.statusSelect = new DefaultSelect();
    // this.emitTevents.emit(type);
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoEvento: [null, [Validators.required]],
      fechapageFin: [null, [Validators.required]],
      statusEvento: [null, [Validators.required]],
      coordRegional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      usuario: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
];
