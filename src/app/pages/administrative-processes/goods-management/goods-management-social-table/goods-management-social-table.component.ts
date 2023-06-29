import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map, takeUntil } from 'rxjs';
import { ITVGoodsTracker } from 'src/app/core/models/ms-good-tracker/vtempTracker.model';
import { GoodViewTrackerService } from 'src/app/core/services/ms-good-tracker/good-v-tracker.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';
import { GoodsManagementSocialNotLoadGoodsComponent } from './goods-management-social-not-load-goods/goods-management-social-not-load-goods.component';

@Component({
  selector: 'app-goods-management-social-table',
  templateUrl: './goods-management-social-table.component.html',
  styleUrls: ['./goods-management-social-table.component.scss'],
})
export class GoodsManagementSocialTable
  extends BasePageWidhtDinamicFiltersExtra<ITVGoodsTracker>
  implements OnInit
{
  private _selectedGoods: number[];
  notLoadedGoods: { good: number }[] = [];
  @Input() identifier: number;
  @Input()
  get selectedGoods(): number[] {
    return this._selectedGoods;
  }
  set selectedGoods(value) {
    if (value.length > 0) {
      this._selectedGoods = value;
      this.getData();
    }
  }
  @Input() set clear(value: number) {
    if (value > 0) {
      this.notLoadedGoods = [];
      this.dataNotFound();
    }
  }
  @Input() option: string;
  constructor(
    private modalService: BsModalService,
    private goodTrackerService: GoodViewTrackerService
  ) {
    super();
    this.service = this.goodTrackerService;
    this.haveInitialCharge = false;
    this.ilikeFilters = ['goodDescription', 'statusDescription', 'destiny'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
      actions: null,
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  optionString(cabinetSocial: string) {
    switch (cabinetSocial) {
      case '1':
        return 'Susceptible';
      case '2':
        return 'Asignado';
      case '3':
        return 'Entregado';
      case '4':
        return 'Liberar';
      default:
        return 'Sin Asignar';
    }
  }

  showNotLoads() {
    let config: ModalOptions = {
      initialState: {
        data: this.notLoadedGoods,
        totalItems: this.notLoadedGoods.length,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodsManagementSocialNotLoadGoodsComponent, config);
  }

  override getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.goodNumber'] = '$in:' + this.selectedGoods.toString();
    if (this.service) {
      this.service
        .getAll(params)
        .pipe(
          takeUntil(this.$unSubscribe),
          map(response => {
            return {
              ...response,
              data: response.data.map(row => {
                return {
                  ...row,
                  officeProc: this.optionString(row.cabinetSocial),
                };
              }),
            };
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.totalItems = response.count || 0;
              this.notLoadedGoods = [];
              this.selectedGoods.forEach(x => {
                if (
                  !response.data
                    .map((item: any) => item.goodNumber)
                    .toString()
                    .includes(x)
                ) {
                  this.notLoadedGoods.push({ good: x });
                }
              });
              this.data.load(response.data);
              this.data.refresh();
              this.loading = false;
            }
          },
          error: err => {
            this.notLoadedGoods = [];
            this.dataNotFound();
          },
        });
    } else {
      this.notLoadedGoods = [];
      this.dataNotFound();
    }
  }
}
