import { Component, OnInit } from '@angular/core';
import { AccountingService } from 'src/app/core/services/ms-accounting/accounting.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IMandExpenseCont } from 'src/app/core/models/ms-accounting/mand-expensecont';
import { ICabms } from 'src/app/core/services/ms-payment/payment-service';
import { PartContSirsaeComponent } from '../part-cont-sirsae/part-cont-sirsae.component';
import { COLUMNS } from './columns';
import { MandByGoodsModalComponent } from './mand-by-goods-modal/mand-by-goods-modal.component';

@Component({
  selector: 'app-mand-by-goods',
  templateUrl: './mand-by-goods.component.html',
  styleUrls: ['./mand-by-goods.component.scss'],
})
export class MandByGoodsComponent
  extends BasePageTableNotServerPagination<IMandExpenseCont>
  implements OnInit
{
  total: any = 0;
  spentId: number;
  selected: IMandExpenseCont;
  constructor(
    private dataService: AccountingService,
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.service = this.dataService;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
    };
  }

  selectRow(row: IMandExpenseCont) {
    this.selected = row;
  }

  async delete(row: IMandExpenseCont) {
    const response = await this.alertQuestion(
      'warning',
      '¿Desea eliminar este registro?',
      ''
    );
    if (response.isConfirmed) {
      this.dataService
        .remove(row)
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert('success', 'Elemento eliminado correctamente', '');
            this.getData();
          },
          error: err => {
            this.alert(
              'error',
              'No se pudo eliminar la partida por mandato ' +
                row.mandxexpensecontId,
              'Favor de verificar'
            );
          },
        });
    }
  }

  add() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      spentId: this.spentId,
      callback: (next: boolean) => {
        this.getData();
      },
    };
    this.modalService.show(MandByGoodsModalComponent, modalConfig);
  }

  edit(row: IMandExpenseCont) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      spentId: this.spentId,
      row,
      callback: (next: boolean) => {
        if (next) {
          this.dataService
            .updateMassive(this.dataTemp)
            .pipe(take(1))
            .subscribe({
              next: response => {
                this.getData();
                this.alert('success', 'Partidas actualizada correctamente', '');
              },
              error: err => {
                this.loading = false;
                this.alert(
                  'success',
                  'No se pudieron actualizar las partidas',
                  'Favor de verificar'
                );
                this.getData();
              },
            });
        } else {
          this.getData();
        }
      },
    };
    this.modalService.show(MandByGoodsModalComponent, modalConfig);
  }

  showPartContSirsae() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      mand: this.selected,
      callback: (obj: { selected: ICabms; apply: boolean }) => {
        console.log(obj);
        this.loading = true;
        if (obj.apply) {
          let filterData = this.dataTemp
            .filter(row => row.departurestop === this.selected.departurestop)
            .map(row => {
              return {
                ...row,
                cabms: obj.selected.CLKCABMS,
                descabms: obj.selected.CVDSC,
                cooperation: obj.selected.CODOPE,
                departure: obj.selected.CVPART,
                categorycabms: obj.selected.CLKSUBCAT + '',
              };
            });
          this.dataService
            .updateMassive(filterData)
            .pipe(take(1))
            .subscribe({
              next: response => {
                this.getData();
                this.alert('success', 'Partidas actualizada correctamente', '');
              },
              error: err => {
                this.loading = false;
                this.alert(
                  'success',
                  'No se pudieron actualizar las partidas',
                  'Favor de verificar'
                );
              },
            });
          //update massive
          this.loading = false;
        } else {
          let newRow = {
            ...this.selected,
            cabms: obj.selected.CLKCABMS,
            descabms: obj.selected.CVDSC,
            cooperation: obj.selected.CODOPE,
            departure: obj.selected.CVPART,
            categorycabms: obj.selected.CLKSUBCAT + '',
          };
          this.dataService
            .update(newRow)
            .pipe(take(1))
            .subscribe({
              next: response => {
                // this.data.forEach(x => {
                //   if (x.mandxexpensecontId === this.selected.mandxexpensecontId) {
                //     x = newRow;
                //   }
                // });
                // this.dataTemp = [...this.data];
                // this.getPaginated(this.params.value);
                // this.loading = false;
                this.getData();
                this.alert('success', 'Partida actualizada correctamente', '');
              },
              error: err => {
                this.loading = false;
                this.alert(
                  'success',
                  'No se pudo actualizar la partida',
                  'Favor de verificar'
                );
              },
            });
        }
      },
    };
    this.modalService.show(PartContSirsaeComponent, modalConfig);
  }

  override getParams() {
    let newColumnFilters: any = [];
    if (this.spentId && this.spentId) {
      newColumnFilters['filter.spentId'] = this.spentId;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  override setTotals(data: IMandExpenseCont[]): void {
    this.total = 0;
    data.forEach(x => {
      this.total += +x.amount;
    });
    this.total = this.total.toFixed(2);
  }

  close() {
    this.modalRef.hide();
  }
}
