import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IValidatorsProceedings } from 'src/app/core/models/catalogs/validators-proceedings-model';
import { ValidatorsProceedingsService } from 'src/app/core/services/catalogs/validators-proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceDocumentValidatorsModalComponent } from '../maintenance-document-validators-model/maintenance-document-validators-model.component';
import { MAINTANANCE_DOCUMENT_VALIDATORS_COLUMNS } from './maintenance-document-validators-columns';

@Component({
  selector: 'app-maintenance-document-validators',
  templateUrl: './maintenance-document-validators.component.html',
  styles: [],
})
export class MaintenanceDocumentValidatorsComponent
  extends BasePage
  implements OnInit
{
  maintenanceDocumentForm: FormGroup;
  validatorsProceedings: IValidatorsProceedings[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private validatorsProceedingsService: ValidatorsProceedingsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: MAINTANANCE_DOCUMENT_VALIDATORS_COLUMNS,
    };
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
          this.getMaximumTimeAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMaximumTimeAll());
  }
  getMaximumTimeAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.validatorsProceedingsService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.validatorsProceedings = response.data;
        this.data.load(this.validatorsProceedings);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(validatorsProceedings?: IValidatorsProceedings) {
    let config: ModalOptions = {
      initialState: {
        validatorsProceedings,
        callback: (next: boolean) => {
          if (next) this.getMaximumTimeAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceDocumentValidatorsModalComponent, config);
  }
  opendelete(validatorsProceedings: any) {
    console.log(validatorsProceedings);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.validatorsProceedingsService
          .remove(validatorsProceedings.certificateType)
          .subscribe({
            next: () => {
              this.onLoadToast('success', 'Se ha eliminado', '');
              this.getMaximumTimeAll();
            },
            error: err => this.onLoadToast('error', err.error.message, ''),
          });
      }
    });
  }
}
