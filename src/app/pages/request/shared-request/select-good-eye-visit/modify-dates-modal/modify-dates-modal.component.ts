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
  minDate: Date = new Date();
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
        'Fechas de inicio y fin son requeridas \n La fecha fin no puede ser menor a la de inicio'
      );

      this.dateForm.controls['startDate'].setValue(null);
      this.dateForm.controls['endDate'].setValue(null);

      return;
    }

    this.goods.map(async (item, _i) => {
      let index = _i + 1;
      const body = {
        goodresdevId: item.goodresdevId,
        instanceDate: this.formatDate(startDate),
        instancebpel: this.formatDate(endDate),
        startVisitDate: moment(startDate).format('YYYY-MM-DD h:mm:ss'),
        endVisitDate: moment(endDate).format('YYYY-MM-DD h:mm:ss'),
      };

      const result = await this.updateGoodResDev(body);

      if (index == this.goods.length) {
        this.onLoadToast('success', 'Visita Ocular registrada', '');
        this.event.emit(this.dateForm.value);
        this.close();
      }
    });
    // Guardar las fechas y enviar al formulario padre para actualizar
  }

  formatDate(startDate: Date): string {
    let year = startDate.getFullYear();
    let month = String(startDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan en 0
    let day = String(startDate.getDate()).padStart(2, '0');
    let hours = String(startDate.getHours()).padStart(2, '0');
    let minutes = String(startDate.getMinutes()).padStart(2, '0');
    let seconds = String(startDate.getSeconds()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Formato YYYY-MM-DD h:mm:ss

    return formattedDate;
  }

  isValidDate(startDate: string, endDate: string): boolean {
    let start = moment(startDate);
    let end = moment(endDate);
    return start.isValid() && end.isValid() && end.isAfter(start);
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
