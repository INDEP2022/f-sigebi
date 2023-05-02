import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'transfer-autority-filter',
  templateUrl: './transfer-autority-filter.component.html',
  styles: [],
})
export class TransferAutorityFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  transfers = new DefaultSelect();
  transmitters = new DefaultSelect();
  autorities = new DefaultSelect();
  transmitterParams = new FilterParams();
  autoritiesParams = new FilterParams();

  constructor(
    private trasnferService: TransferenteService,
    private stationService: StationService,
    private autorityService: AuthorityService
  ) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getTransfers(params: ListParams) {
    this.trasnferService.getAll(params).subscribe({
      next: res => (this.transfers = new DefaultSelect(res.data, res.count)),
    });
  }

  transferChange() {
    this.transmitterParams.removeAllFilters();
    this.getTransmitters();
  }

  transmitterChange() {
    this.transmitterParams.removeAllFilters();
    this.getAutorities();
  }

  getTransmitters(params?: ListParams) {
    if (params) {
      const { page, limit, text } = params;
      this.transmitterParams.page = page;
      this.transmitterParams.limit = limit;
      this.transmitterParams.addFilter('stationName', text, SearchFilter.ILIKE);
    }
    if (this.form.controls.transfers.value.length > 0) {
      const transfers = this.form.controls.transfers.value.join(',');
      this.transmitterParams.addFilter(
        'idTransferent',
        transfers,
        SearchFilter.IN
      );
    }

    this.stationService
      .getAllFilter(this.transmitterParams.getParams())
      .subscribe({
        next: res =>
          (this.transmitters = new DefaultSelect(res.data, res.count)),
      });
  }

  getAutorities(params?: ListParams) {
    if (params) {
      const { page, limit, text } = params;
      this.autoritiesParams.page = page;
      this.autoritiesParams.limit = limit;
      this.autoritiesParams.addFilter('stationName', text, SearchFilter.ILIKE);
    }
    if (this.form.controls.transfers.value.length > 0) {
      const transfers = this.form.controls.transfers.value.join(',');
      this.autoritiesParams.addFilter(
        'idTransferer',
        transfers,
        SearchFilter.IN
      );
    }

    if (this.form.controls.transmitters.value.length > 0) {
      const stations = this.form.controls.transmitters.value.join(',');
      this.autoritiesParams.addFilter('idStation', stations, SearchFilter.IN);
    }
    this.autorityService
      .getAllFilter(this.autoritiesParams.getParams())
      .subscribe({
        next: res => (this.autorities = new DefaultSelect(res.data, res.count)),
      });
  }
}
