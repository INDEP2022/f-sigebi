import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rescheduling-form',
  templateUrl: './rescheduling-form.component.html',
  styles: [],
})
export class ReschedulingFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  reasonData = new DefaultSelect();
  goodSelect: IGood[] = [];
  programming: Iprogramming;
  reprogrammings = new DefaultSelect<IGeneric>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService,
    private goodService: GoodService,
    private programmingGoodService: ProgrammingGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getReportData(new ListParams());
  }

  getReportData(params: ListParams) {
    params['filter.name'] = 'Reprogramacion';
    this.genericService.getAll(params).subscribe({
      next: response => {
        this.reprogrammings = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      reason: [null],
    });
  }
  close() {
    this.modalRef.hide();
  }

  getReasonSelect(reason: ListParams) {}

  confirm() {
    if (this.form.get('reason').value) {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_PROGRAMACION_TMP',
          programmationStatus: 'EN_PROGRAMACION_TMP',
          reasonCancReprog: this.form.get('reason').value,
          reprogrammationNumber: 1,
        };

        this.goodService.updateByBody(formData).subscribe({
          next: response => {
            const formData: Object = {
              programmingId: this.programming.id,
              goodId: item.id,
              status: 'EN_PROGRAMACION_TMP',
            };
            this.programmingGoodService
              .updateGoodProgramming(formData)
              .subscribe({
                next: response => {
                  this.modalRef.content.callback(true);
                  this.modalRef.hide();
                },
                error: error => {},
              });
          },
          error: error => {},
        });
      });
    } else {
      this.alertInfo(
        'warning',
        'Acción Inválida',
        'Se necesita un motivo de reprogramación'
      ).then();
    }
  }
}
