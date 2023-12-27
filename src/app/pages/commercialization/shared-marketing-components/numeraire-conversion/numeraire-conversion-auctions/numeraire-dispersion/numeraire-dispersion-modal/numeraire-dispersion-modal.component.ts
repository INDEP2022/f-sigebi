import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { INumeraryxGoods } from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryXGoodsService } from 'src/app/core/services/ms-numerary/numerary-x-goods.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { formatForIsoDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-numeraire-dispersion-modal',
  templateUrl: './numeraire-dispersion-modal.component.html',
  styleUrls: ['./numeraire-dispersion-modal.component.css'],
})
export class NumeraireDispersionModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  row: INumeraryxGoods;
  title = 'Dispersión de Gastos';
  eventId: number;
  spentId: number;
  constructor(
    private service: NumeraryXGoodsService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      numeraryxGoodId: [this.row ? this.row.numeraryxGoodId : null],
      goodNumber: [this.row ? this.row.goodNumber : null],
      date: [this.row ? formatForIsoDate(this.row.date, 'string') : null],
      amount: [
        this.row ? this.row.amount : null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      apply: [this.row ? this.row.apply : null],
    });
  }

  get maxAmount() {
    return this.row ? this.row.amount : null;
  }

  get goodNumber() {
    return this.form.get('goodNumber');
  }

  get amount() {
    return this.form.get('amount');
  }

  get date() {
    return this.form.get('date');
  }

  confirmSave() {
    let body = this.form.value;
    delete body.date;
    if (body) {
      let serviceAction = this.row
        ? this.service.updateAmount({
            ...body,
            eventId: this.row.eventId,
            spentId: this.spentId,
          })
        : this.service.add({
            ...body,
            eventId: this.eventId,
            spentId: this.spentId,
          });
      serviceAction.pipe(take(1)).subscribe({
        next: response => {
          this.modalRef.content.callback(this.row ? true : false);
          this.modalRef.hide();
        },
        error: err => {
          if (this.row) {
            this.alert('error', 'No se pudo actualizar', '');
          } else {
            this.alert('error', 'No se pudo registrar', '');
          }
        },
      });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
