import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';

@Component({
  selector: 'app-sampling-detail',
  templateUrl: './sampling-detail.component.html',
  styleUrls: ['./sampling-detail.component.scss'],
})
export class SamplingDetailComponent implements OnInit {
  @Input() sampleInfo: ISample;
  constructor(
    private delegationService: RegionalDelegationService,
    private goodsQueryService: GoodsQueryService
  ) {}
  delegationName: string = '';
  addressWarehouse: string = '';
  nameWarehouse: string = '';
  ngOnInit(): void {
    //this.initForm();
  }

  ngOnChanges() {
    if (this.sampleInfo) this.showCorrectInfo();
  }

  showCorrectInfo() {
    this.sampleInfo.startDate = moment(this.sampleInfo?.startDate).format(
      'DD/MM/YYYY'
    );
    this.sampleInfo.endDate = moment(this.sampleInfo?.endDate).format(
      'DD/MM/YYYY'
    );
    this.sampleInfo.creationDate = moment(this.sampleInfo?.creationDate).format(
      'DD/MM/YYYY'
    );

    this.showDelegationName();
    this.showWarehouseInfo();
  }

  showDelegationName() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.sampleInfo?.regionalDelegationId;
    this.delegationService.getAll(params.getValue()).subscribe({
      next: response => {
        this.delegationName = response.data[0].description;
      },
    });
  }

  showWarehouseInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = this.sampleInfo?.warehouseId;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        console.log('response', response);
        this.addressWarehouse = response.data[0].address1;
        this.nameWarehouse = response.data[0].name;
      },
      error: error => {},
    });
  }
}
