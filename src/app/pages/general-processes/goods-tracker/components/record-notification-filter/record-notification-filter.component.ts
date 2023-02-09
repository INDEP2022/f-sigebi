import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'record-notification-filter',
  templateUrl: './record-notification-filter.component.html',
  styles: [],
})
export class RecordNotificationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  courts = new DefaultSelect();
  publicMins = new DefaultSelect();
  constructor(
    private courtService: CourtService,
    private minPubService: MinPubService
  ) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getMinPubs(params: ListParams) {
    this.minPubService.getAll(params).subscribe({
      next: res => (this.publicMins = new DefaultSelect(res.data, res.count)),
    });
  }

  getCourts(params: ListParams) {
    this.courtService.getAll(params).subscribe({
      next: res => (this.courts = new DefaultSelect(res.data, res.count)),
    });
  }
}
