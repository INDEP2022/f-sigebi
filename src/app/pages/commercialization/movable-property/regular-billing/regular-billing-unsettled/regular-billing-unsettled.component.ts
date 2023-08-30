import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_UNSETTLED_COLUMNS } from './regular-billing-unsettled-columns';

@Component({
  selector: 'app-regular-billing-unsettled',
  templateUrl: './regular-billing-unsettled.component.html',
  styles: [],
})
export class RegularBillingUnsettledComponent
  extends BasePage
  implements OnInit
{
  dataFilter: LocalDataSource = new LocalDataSource();
  @Input() form: FormGroup;
  totalItems = 0;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private prepareEventService: ComerEventService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REGULAR_BILLING_UNSETTLED_COLUMNS },
    };
  }

  ngOnInit(): void {}

  search() {
    this.loading = true;
    const { event, idAllotment } = this.form.value;
    this.prepareEventService.getNotification(event, idAllotment).subscribe({
      next: resp => {
        this.loading = false;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
        this.totalItems = resp.count;
      },
      error: error => {
        this.loading = false;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.totalItems = 0;
        this.alert('warning', 'Atención', error.error.message);
      },
    });
  }
}
