import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IContract } from 'src/app/core/models/administrative-processes/contract.model';
import { ContractService } from 'src/app/core/services/contract/strategy-contract.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ContractsDetailComponent } from '../contracts-detail/contracts-detail.component';
import { CONTRACTS_COLUMNS } from './contracts-columns';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styles: [],
})
export class ContractsComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  columns: IContract[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private contractService: ContractService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...CONTRACTS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'contractKey':
                searchFilter = SearchFilter.EQ;
                break;
              case 'startDate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'endDate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'statusContract':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zoneContractKey':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}.description`;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getContractsAll();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.data) this.getContractsAll();
      },
    });
  }

  getContractsAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.columns = [];
    this.contractService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.columns = response.data;
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load(this.columns);
      },
    });
  }

  openForm(contract?: IContract) {
    console.log('antes modal ', contract);
    let config: ModalOptions = {
      initialState: {
        contract,
        callback: (next: boolean) => {
          if (next) this.getContractsAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ContractsDetailComponent, config);
  }

  showDeleteAlert(contract?: IContract) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(contract.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.contractService.remove(id).subscribe({
      next: response => {
        console.log(response);
        this.getContractsAll();
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
