import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
  selector: 'app-cancelation-good-form',
  templateUrl: './cancelation-good-form.component.html',
  styles: [],
})
export class CancelationGoodFormComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  cancelations = new DefaultSelect<IGeneric>();
  goodSelect: IGood[] = [];
  programming: Iprogramming;
  constructor(
    private modalRef: BsModalRef,
    private genericService: GenericService,
    private fb: FormBuilder,
    private programmingGoodService: ProgrammingGoodService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCancelInfo(new ListParams());
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cancelation: [null, [Validators.required]],
    });
  }

  getCancelInfo(params: ListParams) {
    params['filter.name'] = 'Cancelacion';
    this.genericService.getAll(params).subscribe({
      next: response => {
        console.log('cancelación', response);
        this.cancelations = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  confirm() {
    if (this.form.get('cancelation').value) {
      this.goodSelect.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          goodId: item.goodId,
          status: 'CANCELADO_TMP',
        };

        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: response => {
            const formData: Object = {
              id: item.id,
              goodId: item.goodId,
              goodStatus: 'CANCELADO_TMP',
              programmationStatus: 'CANCELADO_TMP',
              reasonCancReprog: this.form.get('cancelation').value,
            };

            this.goodService.updateByBody(formData).subscribe({
              next: response => {
                console.log('actualizado', response);
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

  close() {
    this.modalRef.hide();
  }
}
