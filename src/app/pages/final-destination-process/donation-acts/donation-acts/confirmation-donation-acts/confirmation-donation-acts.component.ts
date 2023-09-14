import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared';

export class Update {
  statusProceedings: any = '';
}

@Component({
  selector: 'app-confirmation-donation-acts',
  templateUrl: './confirmation-donation-acts.component.html',
  styles: [],
})
export class ConfirmationDonationActsComponent
  extends BasePage
  implements OnInit
{
  //

  callback: any;
  totalLocal: number = 0;

  //

  constructor(
    public modalRef: BsModalService,
    private serviceDeliveryReception: DetailProceeDelRecService
  ) {
    super();
  }

  ngOnInit(): void {
    this.callback = this.modalRef.config.initialState;
    console.log('El objeto que se recibe: ', this.callback.data);
  }

  //

  loopCloseMasive() {
    let object: Update = new Update();
    this.callback.data;
    if (this.callback.data != null) {
      let data: any[] = this.callback.data;
      for (const i of data) {
        object.statusProceedings = 'CERRADA';
        this.closeReport(object, i?.id, 1, data.length);
        // console.log("El id que voy a eliminar: ", i.numberGood);
      }
    }
    this.modalRef.hide();
  }

  closeReport(body: any, id: number, all: number, allArray: number) {
    this.serviceDeliveryReception
      .putProceedingsDeliveryReception(body, id)
      .subscribe({
        next: response => {
          console.log('El total: ', all);
          this.totalLocal += all;
          console.log('La variable local ', this.totalLocal);
          // Incrementamos el contador de elementos procesados
          if (allArray === this.totalLocal) {
            // Si todos los elementos han sido procesados
            this.alert('success', 'La Acta Ha Sido Cerrada', '');
          }
        },
        error: error => {
          if (allArray === this.totalLocal) {
            this.alert('error', 'Error', 'Ha Ocurrido un Error');
          }
        },
      });
  }

  close() {
    this.modalRef.hide();
  }

  //
}
