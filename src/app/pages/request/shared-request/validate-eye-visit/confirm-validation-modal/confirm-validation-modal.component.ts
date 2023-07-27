import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export const resultContribuyente: any = [
  {
    id: 'ACEPTADO',
    description: 'ACEPTADO',
  },
  {
    id: 'ACEPTADO PROVISIONALMENTE',
    description: 'ACEPTADO PROVISIONALMENTE',
  },
  {
    id: 'RECHAZADO',
    description: 'RECHAZADO',
  },
  {
    id: 'NO ASISTIO',
    description: 'NO ASISTIO',
  },
  {
    id: 'REPROGRAMAR',
    description: 'REPROGRAMAR',
  },
];

@Component({
  selector: 'app-confirm-validation-modal',
  templateUrl: './confirm-validation-modal.component.html',
  styles: [],
})
export class ConfirmValidationModalComponent implements OnInit {
  title: string = 'Confirmar Validación';
  confirmForm: FormGroup = new FormGroup({});
  selectResultTaxpayer = new DefaultSelect();

  requestId: number = null;
  goods: any = {};

  /* INJECT */
  private bsModalRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  private rejectedGoodService = inject(RejectedGoodService);

  constructor() {}

  ngOnInit(): void {
    this.confirmForm = this.fb.group({
      resultTaxpayer: [null, [Validators.required]],
      observationsResult: [null, [Validators.required]],
    });
  }

  close() {
    this.bsModalRef.hide();
  }

  getResultTax(params: ListParams) {
    this.selectResultTaxpayer = new DefaultSelect(
      resultContribuyente,
      resultContribuyente.length
    );
  }

  async confirm() {
    const form = this.confirmForm.value;
    if (form.resultTaxpayer == 'ACEPTADO') {
      const resultadoFinal = 'y';
      const agrupador = this.goods.goodGrouper;
      const idBien = this.goods.goodresdevId;

      const groupList: any = await this.getlistGroupNumber(agrupador);
      if (groupList.count > 0) {
        groupList.data.map(async (item: any) => {
          const bienRow = item.goodresdevId;
          const agrupadorRow = item.goodGrouper;
          const resFinalRow = item.resultFinal;

          if (
            idBien == bienRow &&
            (agrupador == null || agrupador == agrupadorRow)
          ) {
            if (
              resFinalRow != 'Y' ||
              form.resultTaxpayer == 'ACEPTADO PROVISIONALMENTE' ||
              form.resultTaxpayer == 'REPROGRAMAR'
            ) {
              item.resultTaxpayer = 'RECHAZADO';
              item.resultFinal = 'Y';

              //deleteReverveGood(item);
            }
          }
        });
      }
    } else if (form.resultTaxpayer == 'ACEPTADO PROVISIONALMENTE') {
    } else if (form.resultTaxpayer == 'RECHAZADO') {
    } else if (form.resultTaxpayer == 'NO ASISTIO') {
    } else if (form.resultTaxpayer == 'REPROGRAMAR') {
    }
  }

  getlistGroupNumber(groupId: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.goodGrouper'] = `$eq:${groupId}`;
      this.rejectedGoodService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }
}
