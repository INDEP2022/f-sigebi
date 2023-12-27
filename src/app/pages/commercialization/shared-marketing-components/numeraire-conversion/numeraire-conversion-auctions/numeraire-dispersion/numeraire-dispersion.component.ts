import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { INumeraryxGoods } from 'src/app/core/models/ms-numerary/numerary.model';
import { IFillExpenseDataCombined } from 'src/app/core/models/ms-spent/comer-expense';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { NumeraryXGoodsService } from 'src/app/core/services/ms-numerary/numerary-x-goods.service';
import { TABLE_SETTINGS } from 'src/app/core/shared/base-page';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { NumerarieService } from '../../services/numerarie.service';
import { COLUMNS } from './columns';
import { NumeraireDispersionModalComponent } from './numeraire-dispersion-modal/numeraire-dispersion-modal.component';

@Component({
  selector: 'app-numeraire-dispersion',
  templateUrl: './numeraire-dispersion.component.html',
  styleUrls: ['./numeraire-dispersion.component.scss'],
})
export class NumeraireDispersionComponent
  extends BasePageWidhtDinamicFiltersExtra<INumeraryxGoods>
  implements OnInit
{
  @Input() selectedExpenseData: IFillExpenseDataCombined;
  @Input() idEvento: number;
  @Input() updateAllowed = false;
  toggleInformation = true;
  total = 0;
  fillData = true;
  constructor(
    private modalService: BsModalService,
    private dataService: NumeraryXGoodsService,
    private eventService: ComerEventosService,
    private numerarieService: NumerarieService
  ) {
    super();
    this.haveInitialCharge = false;
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
      this.getTotals();
    }
  }

  override extraOperationsGetData() {
    this.total = 0;
    this.getTotals();
  }

  private getTotals() {
    let body: any = {
      eventId: +(this.idEvento + ''),
      apply: 'S',
      spentId: +(this.selectedExpenseData.id_gasto + ''),
    };
    if (this.selectedExpenseData.cvman) {
      body.cvman = this.selectedExpenseData.cvman;
    }
    this.eventService
      .getTotalNumeraryxGoodsEventApplySpent(body)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.total = response;
        },
      });
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
    // newColumnFilters.limit = 1000000;
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
      ...this.columnFilters,
    };
  }

  edit(row: INumeraryxGoods) {
    console.log(row);

    const config = {
      ...MODAL_CONFIG,
      initialState: {
        row,
        eventId: this.idEvento,
        spentId: +(this.selectedExpenseData.id_gasto + ''),
        callback: (next: boolean) => {
          if (next) {
            this.alert('success', 'Se realizó la edición del bien', '');
          } else {
            this.alert('success', 'Se realizó el registro del bien', '');
          }
          this.numerarieService.reloadExpenses++;
          this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(NumeraireDispersionModalComponent, config);
  }

  // override setTotals(data: INumeraryxGoods[]): void {
  //   this.total = 0;
  //   data.forEach(x => {
  //     this.total += +x.amount;
  //   });
  //   this.total = +this.total.toFixed(2);
  //   this.fillData = true;
  // }
}
