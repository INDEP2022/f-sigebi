import { Component, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { EVENT_PREPARATION_ALLOTMENT_COLUMNS } from './event-preparation-allotment-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectEventModalComponent } from '../select-event-modal/select-event-modal.component';
import { CreateNewEventModalComponent } from '../create-new-event-modal/create-new-event-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-c-b-f-fmdvdb-c-event-preparation',
  templateUrl: './c-b-f-fmdvdb-c-event-preparation.component.html',
  styles: [
    `
      .bg-key {
        background-color: #e3e3e3;
        border-radius: 8px !important;
      }
    `,
  ],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CBFFmdvdbCEventPreparationComponent
  extends BasePage
  implements OnInit
{
  event: any = null;
  authKey: string = '';

  settings = { ...TABLE_SETTINGS, actions: false };

  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = EVENT_PREPARATION_ALLOTMENT_COLUMNS;
  }

  ngOnInit(): void {}

  openModal(context?: Partial<SelectEventModalComponent>) {
    const modalRef = this.modalService.show(SelectEventModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.authKey = '';
      }
    });
  }

  openModal2(): void {
    const modalRef = this.modalService.show(
      CreateNewEventModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  data = [
    {
      lote: '1448',
      descripcion: 'Aduana Dos Bocas (1)',
      valorbase: '0',
      idcliente: '240',
      rfc: 'SIIR480502JA1',
    },
    {
      lote: '1448',
      descripcion: 'Aduana Cd. Hidalgo',
      valorbase: '0',
      idcliente: '1596',
      rfc: 'PETJ700101',
    },
    {
      lote: '1448',
      descripcion: 'Aduana Salina Cruz',
      valorbase: '0',
      idcliente: '1458',
      rfc: 'REMJ760712',
    },
    {
      lote: '1448',
      descripcion: 'ALAF Oaxaca',
      valorbase: '0',
      idcliente: '1507',
      rfc: 'MOAR670630',
    },
  ];
}
