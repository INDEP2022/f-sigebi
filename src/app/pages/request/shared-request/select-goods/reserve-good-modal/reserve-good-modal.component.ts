import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-reserve-good-modal',
  templateUrl: './reserve-good-modal.component.html',
  styles: [],
})
export class ReserveGoodModalComponent extends BasePage implements OnInit {
  title: string = 'Seleccione la Cantidad a Reservar';
  good: IGoodsResDev;
  reserveForm: FormGroup = new FormGroup({});
  @Output() onReserve = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('good', this.good);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.reserveForm = this.fb.group({
      reserve: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(parseInt(String(this.good.amount))),
        ],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar caratula
    this.loading = false;
    let availableAmount: number =
      parseInt(String(this.good.amount)) -
      parseInt(this.reserveForm.controls['reserve'].value);
    const data = {
      amount: availableAmount,
      amountToReserve: this.reserveForm.controls['reserve'].value,
    };
    this.rejectedGoodService
      .updateGoodsResDev(this.good.goodresdevId, data)
      .subscribe({
        next: response => {
          console.log('good', response);
          this.modalRef.hide();
        },
        error: error => {},
      });
    /*this.onReserve.emit({
      ...this.good,
      ...this.reserveForm.value,
      reservedAmount: this.reserveForm.controls['reserve'].value,
      availableAmount,
    }); */
    //
  }
}
