import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { INumeraryxGoods } from 'src/app/core/models/ms-numerary/numerary.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { NumeraryXGoodsService } from 'src/app/core/services/ms-numerary/numerary-x-goods.service';
import { TABLE_SETTINGS } from 'src/app/core/shared/base-page';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { COLUMNS } from './columns';
import { NumeraireDispersionModalComponent } from './numeraire-dispersion-modal/numeraire-dispersion-modal.component';

@Component({
  selector: 'app-numeraire-dispersion',
  templateUrl: './numeraire-dispersion.component.html',
  styleUrls: ['./numeraire-dispersion.component.scss'],
})
export class NumeraireDispersionComponent
  extends BasePageTableNotServerPagination<INumeraryxGoods>
  implements OnInit
{
  @Input() selectedExpenseData: IFillExpenseDataCombined;
  @Input() idEvento: number;
  @Input() updateAllowed = false;
  toggleInformation = true;
  total = 0;
  fillData = false;
  constructor(
    private modalService: BsModalService,
    private dataService: NumeraryXGoodsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: false,
    };
    this.service = this.dataService;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['updateAllowed']) {
      if (changes['updateAllowed'].currentValue === false) {
        this.settings = {
          ...this.settings,
          columns: COLUMNS,
          actions: false,
        };
      } else {
        this.settings = {
          ...TABLE_SETTINGS,
          hideSubHeader: false,
          columns: COLUMNS,
          actions: {
            ...TABLE_SETTINGS.actions,
            add: false,
            edit: true,
            delete: false,
          },
        };
      }
    }
    if (changes['selectedExpenseData'] && this.fillData) {
      this.total = 0;
      this.getData();
    }
  }

  override getParams() {
    let newColumnFilters: any = [];
    newColumnFilters['filter.apply'] = '$eq:S';
    newColumnFilters['filter.eventId'] = '$eq:' + this.idEvento;
    newColumnFilters['filter.spentId'] =
      '$eq:' + this.selectedExpenseData.id_gasto;
    if (this.selectedExpenseData.cvman) {
      newColumnFilters['filter.cvman'] =
        '$eq:' + this.selectedExpenseData.cvman;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  edit(row: INumeraryxGoods) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      row,
      eventId: this.idEvento,
      callBack: (next: boolean) => {
        this.getData();
      },
    };
    this.modalService.show(NumeraireDispersionModalComponent, modalConfig);
  }

  override setTotals(data: INumeraryxGoods[]): void {
    this.total = 0;
    data.forEach(x => {
      this.total += +x.amount;
    });
    this.total = +this.total.toFixed(2);
    this.fillData = true;
  }
}
