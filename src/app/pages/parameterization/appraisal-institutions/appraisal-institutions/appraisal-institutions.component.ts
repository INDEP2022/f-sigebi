import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAppraisers } from 'src/app/core/models/catalogs/appraisers.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppraisalInstitutionsModalComponent } from '../appraisal-institutions-modal/appraisal-institutions-modal.component';
import { APPRAISALINSTITUTIONS_COLUMNS } from './appraisal-institutions-columns';

@Component({
  selector: 'app-appraisal-institutions',
  templateUrl: './appraisal-institutions.component.html',
  styles: [],
})
export class AppraisalInstitutionsComponent extends BasePage implements OnInit {
  appraisersList: IAppraisers[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private appraisersService: AppraisersService
  ) {
    super();
    this.settings.columns = APPRAISALINSTITUTIONS_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getValuesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.appraisersService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.appraisersList = response.data;
        this.data.load(this.appraisersList);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  openForm(appraisers?: IAppraisers) {
    let config: ModalOptions = {
      initialState: {
        appraisers,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getValuesAll());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AppraisalInstitutionsModalComponent, config);
  }
  opendelete(appraisers: any) {
    console.log(appraisers);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.appraisersService.remove(appraisers.id).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha eliminado', '');
            this.getValuesAll();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
