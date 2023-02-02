import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { IComerEvent } from '../../../../../core/models/ms-event/event.model';
import { EventSelectionModalComponent } from '../../components/event-selection-modal/event-selection-modal.component';

@Component({
  selector: 'app-authorization-keys-form',
  templateUrl: './authorization-keys-form.component.html',
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
export class CCCaeeoCAuthorizationKeysFormComponent
  extends BasePage
  implements OnInit
{
  event: IComerEvent | null = null;
  authKey: string = '';

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  openModal(context?: Partial<EventSelectionModalComponent>) {
    const modalRef = this.modalService.show(EventSelectionModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: IComerEvent) => {
      if (next) {
        console.log(next);
        this.event = next;
        this.authKey = '';
      }
    });
  }

  // fillEvent() {
  //   this.authKey = '';
  //   this.event = {
  //     id: 1,
  //     event: 'DECBM 01/07',
  //     description:
  //       'SI ESTOY ENTRANDO 3 1 M T PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA',
  //   };
  // }

  generateKey() {
    console.log('Key generated');
    this.authKey = '5G5A9G45HR83QD9S7WN0N1VY2';
  }

  copy() {
    navigator.clipboard.writeText(this.authKey);
    this.onLoadToast(
      'success',
      'Clave de autorización',
      'copiada al portapapeles'
    );
  }
}
