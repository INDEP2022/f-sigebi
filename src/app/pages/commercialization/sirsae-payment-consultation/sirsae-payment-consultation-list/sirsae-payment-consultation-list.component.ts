import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { convertFormatDate, showToast } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { InterfacesirsaeService as InterfaceSirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONSULT_SIRSAE_COLUMNS } from './sirsae-payment-consultation-columns';

@Component({
  selector: 'app-sirsae-payment-consultation-list',
  templateUrl: './sirsae-payment-consultation-list.component.html',
  styles: [],
})
export class SirsaePaymentConsultationListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({
    reference: new FormControl(null),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    bank: new FormControl(null),
    status: new FormControl(null),
  });

  totalItems: number = 0;
  maxDate: Date = new Date();
  consultSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: true,
    columns: CONSULT_SIRSAE_COLUMNS,
  };
  tableSource = new LocalDataSource();
  statusesMov: { id: number; statusDescription: string }[] = [];
  constructor(private interfaceSirsaeService: InterfaceSirsaeService) {
    super();
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(event => this.search(event));
  }

  resetFilter() {
    this.tableSource.empty().then(res => {
      this.tableSource.refresh();
    });
    this.form.reset();
  }

  clearTable(): void {
    if (this.tableSource.count() > 0) {
      this.tableSource.empty().then(() => {
        this.tableSource.refresh();
      });
    }
  }

  search(listParams?: ListParams): void {
    console.log(this.form.value);
    if (!this.formValid()) {
      return;
    }
    this.clearTable();
    this.loading = true;
    const params = this.generateParams(listParams).getParams();
    this.interfaceSirsaeService.getAccountDetail(params).subscribe({
      next: res => {
        console.log(res);
        this.totalItems = res.count;
        this.tableSource.load(res.data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  generateParams(listParams?: ListParams): FilterParams {
    const filters = new FilterParams();
    const { reference, startDate, endDate, bank, status } = this.form.value;

    if (reference) {
      filters.addFilter('reference', reference, SearchFilter.LIKE);
    }
    if (startDate || endDate) {
      const initDate = startDate || endDate;
      const finalDate = endDate || startDate;
      filters.addFilter(
        'movDate',
        `${convertFormatDate(initDate)},${convertFormatDate(finalDate)}`,
        SearchFilter.BTW
      );
    }
    if (bank) {
      filters.addFilter('ifdsc', bank);
    }
    if (status) {
      filters.addFilter('statusMov', status);
    }

    if (listParams) {
      filters.page = listParams.page || 1;
      filters.limit = listParams.limit || 10;
    }
    return filters;
  }

  formValid(): boolean {
    const values = this.form.value;
    const isValid = Object.keys(values).some(key => Boolean(values[key]));
    if (!isValid) {
      showToast({
        title: 'Atención',
        text: 'Favor de llenar un campos',
        icon: 'error',
      });
    }
    return isValid;
  }
}
