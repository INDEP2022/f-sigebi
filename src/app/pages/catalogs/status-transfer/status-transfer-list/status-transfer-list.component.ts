import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStatusTransfer } from 'src/app/core/models/catalogs/status-transfer.model';
import { StatusTransferService } from 'src/app/core/services/catalogs/status-transfer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusTransferFormComponent } from '../status-transfer-form/status-transfer-form.component';
import { STATUSTRANSFER_COLUMS } from './status-transfer-columns';

@Component({
  selector: 'app-status-transfer-list',
  templateUrl: './status-transfer-list.component.html',
  styles: [],
})
export class StatusTransferListComponent extends BasePage implements OnInit {
  paragraphs: IStatusTransfer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private statusTransferService: StatusTransferService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSTRANSFER_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'code':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.statusTransferService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusTransfer?: IStatusTransfer) {
    let config: ModalOptions = {
      initialState: {
        statusTransfer,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusTransferFormComponent, config);
  }

  delete(statusTransfer: IStatusTransfer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.ShowDeleteAlert(statusTransfer.id);
        //Ejecutar el servicio
      }
    });
  }

  ShowDeleteAlert(id: number) {
    this.statusTransferService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Estado Transferencia', 'Borrado Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Estado Transferencia',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
