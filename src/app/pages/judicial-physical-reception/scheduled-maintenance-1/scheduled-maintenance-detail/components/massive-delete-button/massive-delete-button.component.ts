import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { AlertButton } from '../../../models/alert-button';

@Component({
  selector: 'app-massive-delete-button',
  templateUrl: './massive-delete-button.component.html',
  styles: [
    `
      @media screen and (max-width: 576px) {
        button {
          width: 100%;
        }
      }
    `,
  ],
})
export class MassiveDeleteButtonComponent
  extends AlertButton
  implements OnInit
{
  @Input() disabled: boolean;
  @Input() actaId: any;
  @Input() selecteds: IGoodsByProceeding[];
  @Input() typeProceeding: string;
  @Output() finishDelete = new EventEmitter();
  constructor(
    private detailService: ProceedingsDetailDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {}

  deleteGoods() {
    this.alertQuestion(
      'warning',
      '¿Desea eliminar estos registros?',
      this.selecteds.map(selected => selected.no_bien).toString()
    ).then(question => {
      if (question.isConfirmed) {
        const byRastrer = this.selecteds.filter(x => x.agregado === 'RA');
        const notRastrer = this.selecteds.filter(x => x.agregado !== 'RA');
        let deletedByRastrer: IGoodsByProceeding[] = [];
        if (byRastrer.length > 0) {
          deletedByRastrer = byRastrer;
        }
        if (notRastrer.length > 0) {
          this.detailService
            .deleteByBP(this.actaId, this.typeProceeding, notRastrer)
            .subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Eliminación',
                  `Bienes Eliminados Correctamente`
                );
                // console.log(response);
                // const removeds: string[] = [];
                // const notRemoveds: string[] = [];
                // response.forEach(item => {
                //   const { deleted } = item as IDeleted;
                //   const { error } = item as INotDeleted;
                //   if (deleted) {
                //     removeds.push(deleted);
                //   }
                //   if (error) {
                //     notRemoveds.push(error);
                //   }
                // });
                // this.showMessageGoodsRemoved(removeds, notRemoveds);
                this.finishDelete.emit(deletedByRastrer);
              },
              error: err => {
                this.onLoadToast(
                  'error',
                  'ERROR',
                  `No se pudieron eliminar los bienes`
                );
                this.finishDelete.emit(deletedByRastrer);
                // let bienes = '';
                // this.selecteds.forEach((selected, index) => {
                //   bienes +=
                //     selected.no_bien +
                //     (index < this.selecteds.length - 1 ? ',' : '');
                // });
                // this.onLoadToast(
                //   'error',
                //   'ERROR',
                //   `No se pudieron eliminar los bienes No ${bienes}`
                // );
              },
            });
        } else {
          this.finishDelete.emit(deletedByRastrer);
        }
      }
    });
  }

  private showMessageGoodsNotRemoved(notRemoveds: string[]) {
    let goods = '';
    if (notRemoveds.length > 0) {
      notRemoveds.forEach((selected, index) => {
        goods += selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      return `pero no se pudieron los bienes No. ${goods}`;
    } else {
      return '';
    }
  }

  private showMessageGoodsRemoved(removeds: string[], notRemoveds: string[]) {
    let goods = '';
    if (removeds.length > 0) {
      removeds.forEach((selected, index) => {
        goods += selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      this.alert(
        'success',
        'Eliminación',
        `Se eliminaron los bienes No. ${goods} ` +
          this.showMessageGoodsNotRemoved(notRemoveds)
      );
    }
  }
}
