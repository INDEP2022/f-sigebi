import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams, ListParams } from 'src/app/common/repository/interfaces/list-params';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_LCS_WARRANTY } from './columns-warranty';

@Component({
  selector: 'app-can-lcs-warranty',
  templateUrl: './can-lcs-warranty.component.html',
  styleUrls: [],
})
export class CanLcsWarrantyComponent extends BasePage implements OnInit {
  data = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  idEvent: any  = null

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_LCS_WARRANTY,
  };

  constructor(
    private bsModal: BsModalRef,
    private comerLotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData()

    this.params.value.page = 1;
    this.params.value.limit = 10;

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
        this.getData();
      });
  }

  close() {
    this.bsModal.hide();
  }

  getData(){
    this.loading = true
    const paramsF = new FilterParams()
    this.idEvent != null ? paramsF.addFilter('Event_ID', this.idEvent) : '';
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;

    this.comerLotService.getLotComerRefGuarentee().subscribe(
        res => {
            console.log(res)
            this.data.load(res.data)
            this.totalItems = res.count
            this.loading = false
        },
        err => {
            this.loading = false
            console.log(err)
            this.data.load([])
            this.totalItems = 0
        }
    )
  }
}
