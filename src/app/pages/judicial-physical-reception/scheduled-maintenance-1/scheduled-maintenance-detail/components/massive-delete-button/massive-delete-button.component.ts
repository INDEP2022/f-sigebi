import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { AlertButton } from '../../../models/alert-button';
import {
  IDeleted,
  INotDeleted,
} from './../../../../../../core/services/ms-proceedings/proceedings-delivery-reception.service';

@Component({
  selector: 'app-massive-delete-button',
  templateUrl: './massive-delete-button.component.html',
  styles: [],
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
      'Eliminar',
      'Desea eliminar estos registros?'
    ).then(question => {
      if (question.isConfirmed) {
        this.detailService
          .deleteMasive(this.selecteds, this.typeProceeding, this.actaId)
          .subscribe({
            next: response => {
              console.log(response);
              const removeds: string[] = [];
              const notRemoveds: string[] = [];
              response.forEach(item => {
                const { deleted } = item as IDeleted;
                const { error } = item as INotDeleted;
                if (deleted) {
                  removeds.push(deleted);
                }
                if (error) {
                  notRemoveds.push(error);
                }
              });
              this.showMessageGoodsRemoved(removeds, notRemoveds);
              this.finishDelete.emit();
            },
            error: err => {
              let bienes = '';
              this.selecteds.forEach((selected, index) => {
                bienes +=
                  selected.no_bien +
                  (index < this.selecteds.length - 1 ? ',' : '');
              });
              this.onLoadToast(
                'error',
                'ERROR',
                `No se pudieron eliminar los bienes N° ${bienes}`
              );
            },
          });
      }
    });
  }

  private showMessageGoodsNotRemoved(notRemoveds: string[]) {
    let goods = '';
    if (notRemoveds.length > 0) {
      notRemoveds.forEach((selected, index) => {
        goods += selected + (index < this.selecteds.length - 1 ? ',' : '');
      });
      return `pero no se pudieron los bienes N° ${goods}`;
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
      this.onLoadToast(
        'success',
        'Exito',
        `Se eliminaron los bienes N° ${goods} ` +
          this.showMessageGoodsNotRemoved(notRemoveds)
      );
    }
  }
}
