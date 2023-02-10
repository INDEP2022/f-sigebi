import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  getTransmitters(params: ListParams) {
    this.stationService.getAll(params).subscribe({
      next: res => (this.transmitters = new DefaultSelect(res.data, res.count)),
    });
  }

  getAutorities(params: ListParams) {
    this.autorityService.getAll(params).subscribe({
      next: res => (this.autorities = new DefaultSelect(res.data, res.count)),
    });
  }
}
