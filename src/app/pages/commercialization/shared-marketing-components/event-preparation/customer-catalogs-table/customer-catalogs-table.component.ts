import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CUSTOMER_CATALOGS_COLUMNS } from './customer-catalogs-columns';
//models
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
//Services
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';

@Component({
  selector: 'app-customer-catalogs-table',
  templateUrl: './customer-catalogs-table.component.html',
  styles: [],
})
export class CustomerCatalogsTableComponent extends BasePage implements OnInit {
  comerClients: IComerClients[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private comerClientsService: ComerClientsService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CUSTOMER_CATALOGS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClients());
  }

  getComerClients() {
    this.loading = true;
    this.comerClientsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.comerClients = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
