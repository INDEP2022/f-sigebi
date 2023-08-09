import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';

@Component({
  selector: 'app-confirmation-donation-acts',
  templateUrl: './confirmation-donation-acts.component.html',
  styles: [],
})
export class ConfirmationDonationActsComponent implements OnInit {
  //

  callback: any;

  //

  constructor(
    public modalRef: BsModalService,
    private serviceAdmonDonation: DonationService
  ) {}

  ngOnInit(): void {
    this.callback = this.modalRef.config.initialState;
    // console.log('El objeto que se recibe: ', this.callback.data);
  }

  //

  loopCloseMasive() {
    this.callback.data;
    // console.log("Aqui ya recibimos la lista de objetos: ", this.callback.data);
    if (this.callback.data != null) {
      let data: any[] = this.callback.data;
      for (const i of data) {
        this.closeReport(i.numberGood);
        // console.log("El id que voy a eliminar: ", i.numberGood);
      }
    }
    this.modalRef.hide();
  }

  closeReport(id: number) {
    this.serviceAdmonDonation.deleteAdmonDonation(id).subscribe({
      next: response => {
        console.log('');
      },
      error: error => {
        console.log('');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  //
}
