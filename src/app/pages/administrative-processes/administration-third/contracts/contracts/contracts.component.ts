import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IContract } from 'src/app/core/models/administrative-processes/contract.model';
import { ContractService } from 'src/app/core/services/contract/strategy-contract.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONTRACTS_COLUMNS } from './contracts-columns';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styles: [],
})
export class ContractsComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columns: IContract[] = [];
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private contractService: ContractService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CONTRACTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          this.getContractsAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getContractsAll());
  }

  getContractsAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.contractService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
