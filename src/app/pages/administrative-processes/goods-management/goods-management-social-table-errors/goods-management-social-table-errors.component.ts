import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ITmpValSocialLoadSocialCabinet } from 'src/app/core/models/ms-social-cabinet/tmp-val-load-social-cabinet';
import { SocialCabinetService } from 'src/app/core/services/ms-social-cabinet/social-cabinet.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { GoodsManagementService } from '../services/goods-management.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-goods-management-social-table-errors',
  templateUrl: './goods-management-social-table-errors.component.html',
  styleUrls: ['./goods-management-social-table-errors.component.scss'],
})
export class GoodsManagementSocialTableErrorsComponent
  extends BasePageWidhtDinamicFiltersExtra<ITmpValSocialLoadSocialCabinet>
  implements OnInit
{
  @Input() identifier: number;
  @Input() set change(value: number) {
    if (value > 0) {
      this.getData();
    }
  }
  @Input() set clear(value: number) {
    if (value > 0) {
      this.dataNotFound();
    }
  }
  lastClickTime: number = 0;
  selected: ITmpValSocialLoadSocialCabinet[];
  constructor(
    private socialCabinetService: SocialCabinetService,
    private goodManagementeService: GoodsManagementService
  ) {
    super();
    this.haveInitialCharge = false;
    this.service = this.socialCabinetService;
    this.ilikeFilters = ['valMessage'];
    this.settings = { ...this.settings, actions: null, columns: COLUMNS };
  }

  rowSelect(event: { selected: ITmpValSocialLoadSocialCabinet[] }) {
    console.log(event);
    if (this.lastClickTime === 0) {
      this.lastClickTime = new Date().getTime();
      this.selected = event.selected;
    } else {
      const change = new Date().getTime() - this.lastClickTime;
      if (change < 400) {
        this.saveSelected(this.selected);
      }
      this.lastClickTime = 0;
    }
  }

  saveSelected(selected: ITmpValSocialLoadSocialCabinet[]) {
    // this.goodManagementeService.selectedGood = selected.goodNumber;
    console.log(selected);
    if (selected && selected.length > 0) {
      this.goodManagementeService.selectedGoodSubject.next(
        selected[0].goodNumber
      );
    }
  }

  override getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.identifier'] = '$eq:' + this.identifier;
    if (this.service) {
      this.service
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
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
