import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_COMER_CLIENTS } from './columns-comer-clients';

@Component({
  selector: 'app-comer-clients-table',
  templateUrl: './comer-clients-table.html',
  styleUrls: ['./comer-clients-table.component.css'],
})
export class ComerClientsTableComponent extends BasePage implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private guarantyService: GuarantyService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },*/
      columns: { ...COLUMNS_COMER_CLIENTS },
    };
  }

  ngOnInit(): void {
    this.params = this.pageFilter(this.params);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;

    // this.params = this.pageFilter(this.params);
    this.params.getValue()['sortBy'] = `rfc:DESC`;
    let params = {
      ...this.params.getValue(),
      //...this.columnFiltersReprocess,
    };

    this.guarantyService.idEventXClient(params).subscribe({
      next: resp => {
        this.source = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
