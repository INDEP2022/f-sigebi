import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-modify-dates-modal',
  templateUrl: './modify-dates-modal.component.html',
  styles: [],
})
export class ModifyDatesModalComponent extends BasePage implements OnInit {
  title: string = 'Modificar Fechas';
  dateForm: FormGroup = new FormGroup({});
  requestId: number;
  goods: any[];

  private event: EventEmitter<any> = new EventEmitter<any>();

  private bsModalRef = inject(BsModalRef);
  private rejectedService = inject(RejectedGoodService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  confirm() {
    // Primero, verificar si las fechas están presentes
    const startDate = this.dateForm.controls['startDate'].value;
    const endDate = this.dateForm.controls['endDate'].value;

    if (!this.isValidDate(startDate, endDate)) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Fechas de inicio y fin son requeridas'
      );

      this.dateForm.controls['startDate'].setValue(null);
      this.dateForm.controls['endDate'].setValue(null);

      return;
    }

    this.goods.map(async (item, _i) => {
      let index = _i + 1;
      const body = {
        goodresdevId: item.goodresdevId,
        startVisitDate: moment(startDate).format(
          'YYYY-MM-DD h:mm:ss'
        ),
        endVisitDate: moment(endDate).format(
          'YYYY-MM-DD h:mm:ss'
        ),
      };

      const result = await this.updateGoodResDev(body);

      if (index == this.goods.length) {
        this.onLoadToast('success', 'Visita Ocupar registrada', '');
        this.event.emit(this.dateForm.value);
        this.close();
      }
    });
    // Guardar las fechas y enviar al formulario padre para actualizar
  }

  isValidDate(startDate: string, endDate: string): boolean {
    return !isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate));
  }

  updateGoodResDev(body: any) {
    return new Promise((resolve, reject) => {
      this.rejectedService
        .updateGoodsResDev(body.goodresdevId, body)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            this.onLoadToast(
              'error',
              'Ocurrio un error al actualizar las fechas de visita',
              ''
            );
            reject('error al actualizar la fecha');
          },
        });
    });
  }
}
