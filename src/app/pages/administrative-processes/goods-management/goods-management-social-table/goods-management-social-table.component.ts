import { Component, Input, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';
@Component({
  selector: 'app-goods-management-social-table',
  templateUrl: './goods-management-social-table.component.html',
  styleUrls: ['./goods-management-social-table.component.scss'],
})
export class GoodsManagementSocialTable
  extends BasePageWidhtDinamicFiltersExtra<ITrackedGood>
  implements OnInit
{
  private _selectedGoods: number[];
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
      this.dataNotFound();
    }
  }
  @Input() option: string;
  constructor(private goodTrackerService: GoodTrackerService) {
    super();
    this.service = this.goodTrackerService;
    this.haveInitialCharge = false;
    this.ilikeFilters = ['goodDescription', 'statusDescription', 'destiny'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  optionString() {
    switch (+this.option) {
      case 1:
        return 'Susceptible';
      case 2:
        return 'Asignado';
      case 3:
        return 'Entregado';
      case 4:
        return 'Liberar';
      default:
        return '';
    }
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
                  officeProc: this.optionString(),
                };
              }),
            };
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.totalItems = response.count || 0;
              this.data.load(response.data);
              this.data.refresh();
              this.loading = false;
            }
          },
          error: err => {
            this.dataNotFound();
          },
        });
    } else {
      this.dataNotFound();
    }
  }
}
