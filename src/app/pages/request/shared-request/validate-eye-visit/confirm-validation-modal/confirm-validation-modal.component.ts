import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
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
export class ConfirmValidationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Confirmar Validación';
  confirmForm: FormGroup = new FormGroup({});
  selectResultTaxpayer = new DefaultSelect();
  private event: EventEmitter<any> = new EventEmitter<any>();

  requestId: number = null;
  goods: any = {};

  /* INJECT */
  private bsModalRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  private rejectedGoodService = inject(RejectedGoodService);
  private goodService = inject(GoodService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.goods);
    this.confirmForm = this.fb.group({
      resultTaxpayer: [null, [Validators.required]],
      observationsResult: [null, [Validators.required]],
    });

    this.getResultTax();
  }

  close() {
    this.bsModalRef.hide();
  }

  getResultTax(params?: ListParams) {
    this.selectResultTaxpayer = new DefaultSelect(
      resultContribuyente,
      resultContribuyente.length
    );
  }

  async confirm() {
    const form = this.confirmForm.value;
    let updateItem: any = {};
    debugger;
    if (form.resultTaxpayer == 'ACEPTADO') {
      const resultadoFinal = 'Y';
      const agrupador = this.goods.goodGrouper;
      const idBien = this.goods.goodresdevId;

      const groupList = this.goods;
      if (groupList.length > 0) {
        groupList.map(async (item: any) => {
          const bienRow = item.goodresdevId;
          const agrupadorRow = item.goodGrouper;
          const resFinalRow = item.resultFinal;

          if (
            resFinalRow != 'Y' ||
            item.resultTaxpayer == 'ACEPTADO PROVISIONALMENTE' ||
            item.resultTaxpayer == 'REPROGRAMAR'
          ) {
            item.resultTaxpayer = 'RECHAZADO';
            item.resultFinal = 'Y';

            this.deleteGoodDated(item);
          } else {
            item.resultFinal = 'Y';
            item.resultTaxpayer = form.resultTaxpayer;
            item.observationsResult = form.observationsResult;
          }

          updateItem = {
            goodresdevId: item.goodresdevId,
            resultFinal: item.resultFinal,
            resultTaxpayer: item.resultTaxpayer,
            observationsResult: form.observationsResult,
          };
          this.updateGoodResDev(updateItem);
        });
      }
    } else if (form.resultTaxpayer == 'ACEPTADO PROVISIONALMENTE') {
      const resultadoFinal = 'P';
      this.goods.map((item: any, _i: any) => {
        const updateItem: any = {
          goodresdevId: item.goodresdevId,
          resultFinal: resultadoFinal,
          resultTaxpayer: form.resultTaxpayer,
          observationsResult: form.observationsResult,
        };
        this.updateGoodResDev(updateItem);
      });
    } else if (form.resultTaxpayer == 'RECHAZADO') {
      const resultadoFinal = 'Y';
      this.goods.map(async (item: any, _i: any) => {
        updateItem = {
          goodresdevId: item.goodresdevId,
          resultFinal: resultadoFinal,
          resultTaxpayer: form.resultTaxpayer,
          observationsResult: form.observationsResult,
        };
        await this.deleteGoodDated(item);

        this.updateGoodResDev(updateItem);
      });
    } else if (form.resultTaxpayer == 'NO ASISTIO') {
      const resultadoFinal = 'Y';
      this.goods.map(async (item: any, _i: any) => {
        updateItem = {
          goodresdevId: item.goodresdevId,
          resultFinal: resultadoFinal,
          resultTaxpayer: form.resultTaxpayer,
          observationsResult: form.observationsResult,
        };
        await this.deleteGoodDated(item);

        this.updateGoodResDev(updateItem);
      });
    } else if (form.resultTaxpayer == 'REPROGRAMAR') {
      const resultadoFinal = 'Y';
      //las fechas se establecen en null
      this.goods.map(async (item: any, _i: any) => {
        updateItem = {
          goodresdevId: item.goodresdevId,
          resultFinal: resultadoFinal,
          resultTaxpayer: form.resultTaxpayer,
          observationsResult: form.observationsResult,
          startVisitDate: null,
          endVisitDate: null,
        };

        this.updateGoodResDev(updateItem);
      });
    }

    this.alertInfo('success', 'Los bienes fueron especificados', '').then(
      data => {
        this.event.emit(true);
        this.close();
      }
    );
  }

  async deleteGoodDated(goodDevRes: any) {
    if (goodDevRes.inventoryNumber != null) {
      if (goodDevRes.reservationId != null) {
        //mandar a llamar el endpoint de ProcesosXxsaeFacade (eliminarReservaBIen)
        /* metodo */
        //si la respuesta del endpoint ProcesosXxsaeFacade fue exitosa
        const goodDeleted = await this.deleteGoodResDev(goodDevRes);
      } else {
        const goodDeleted = await this.deleteGoodResDev(goodDevRes);
      }
    } else {
      const good: any = await this.findGoodById(goodDevRes.goodId);
      if (good) {
        const body: any = {
          id: good.id,
          goodId: good.goodId,
          goodResdevId: null,
          compensation: null,
        };
        await this.updateGood(body);
      }
      const goodDeleted = await this.deleteGoodResDev(goodDevRes);
    }
  }

  deleteGoodResDev(good: any) {
    return new Promise((resolve, reject) => {
      this.rejectedGoodService.deleteGoodsResDev(good.goodresdevId).subscribe({
        next: res => {
          resolve(res);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudo eliminar los bienes');
        },
      });
    });
  }

  findGoodById(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.goodService
        .getAll(params)
        .pipe(
          map(x => {
            return x.data[0];
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  updateGood(body: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(body).subscribe({
        next: res => {
          console.log('bien actualizado');
          resolve(true);
        },
        error: error => {
          reject(false);
          this.onLoadToast('error', 'No se pudo actualizar los bienes');
        },
      });
    });
  }

  updateGoodResDev(goodResDev: any) {
    const id = goodResDev.goodresdevId;
    this.rejectedGoodService.updateGoodsResDev(id, goodResDev).subscribe({
      next: resp => {
        console.log('good res dev actualizado');
      },
    });
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
