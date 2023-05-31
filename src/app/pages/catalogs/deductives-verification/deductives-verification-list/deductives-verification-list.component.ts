import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { DeductivesVerificationFormComponent } from '../deductives-verification-form/deductives-verification-form.component';
import { DEDUCTIVE_VERIFICATION_COLUMNS } from './deductives-verification-columns';

@Component({
  selector: 'app-create-deductives-verification-list',
  templateUrl: './deductives-verification-list.component.html',
  styles: [],
})
export class DeductivesVerificationListComponent
  extends BasePage
  implements OnInit
{
  deductives: IDeductiveVerification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private deductiveVerificationService: DeductiveVerificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEDUCTIVE_VERIFICATION_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' || filter.field == 'percentagePena'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.deductiveVerificationService.getAll(params).subscribe({
      next: response => {
        this.deductives = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(deductive?: IDeductiveVerification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      deductive,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(DeductivesVerificationFormComponent, modalConfig);
  }

  showDeleteAlert(deductive: IDeductiveVerification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(deductive.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.deductiveVerificationService.remove(id).subscribe({
      next: () => this.getData(),
    });
  }
}
