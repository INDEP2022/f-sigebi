import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';
import { WarehousesFilterComponent } from '../warehouses-filter/warehouses-filter.component';

@Component({
  selector: 'location-filter',
  templateUrl: './location-filter.component.html',
  styles: [],
})
export class LocationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  select = new DefaultSelect();
  warehouses = new DefaultSelect();
  delegations = new DefaultSelect();
  autorityStates = new DefaultSelect();
  goodStates = new DefaultSelect();
  @Output() cleanFilters = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private delegationService: DelegationService,
    private statesService: StateOfRepublicService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  openWarehouseFilter() {
    this.modalService.show(WarehousesFilterComponent, {
      ...MODAL_CONFIG,
      initialState: {
        callback: (warehouses: IWarehouse[]) => {
          if (!warehouses?.length) {
            return;
          }
          this.warehouses = new DefaultSelect(warehouses, warehouses.length);
          this.form
            .get('warehouse')
            .setValue(warehouses.map(w => w.idWarehouse));
        },
      },
    });
  }

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getWarehouses(params: ListParams) {
    const _params = new FilterParams();
    _params.page = params.page;
    _params.limit = params.limit;
    if (params.text) {
      _params.addFilter('description', params.text, SearchFilter.ILIKE);
    }
    this.warehouseService
      .getAllFilter(_params.getParams())
      // this.warehouseService.getAll(params)
      .subscribe({
        next: res => (this.warehouses = new DefaultSelect(res.data, res.count)),
        error: () => {
          this.warehouses = new DefaultSelect([], 0);
        },
      });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: res => (this.delegations = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.delegations = new DefaultSelect([], 0);
      },
    });
  }

  getAutorityStates(params: ListParams) {
    this.statesService.getAll(params).subscribe({
      next: res =>
        (this.autorityStates = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.autorityStates = new DefaultSelect([], 0);
      },
    });
  }

  getGoodStates(params: ListParams) {
    this.statesService.getAll(params).subscribe({
      next: res => (this.goodStates = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.goodStates = new DefaultSelect([], 0);
      },
    });
  }
}
