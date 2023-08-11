import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IInstitutionClassification } from '../../../../core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from '../../../../core/services/catalogs/institution-classification.service';
import { InstitutionClassificationDetailComponent } from '../institution-classification-detail/institution-classification-detail.component';
import { INSTITUTION_CLASIFICATION_COLUMNS } from './institution-columns';

@Component({
  selector: 'app-institution-classification-list',
  templateUrl: './institution-classification-list.component.html',
  styles: [],
})
export class InstitutionClassificationListComponent
  extends BasePage
  implements OnInit
{
  institutions: IInstitutionClassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private institutionService: InstitutionClasificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INSTITUTION_CLASIFICATION_COLUMNS;
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
            filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'numRegister'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getInstitutions();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInstitutions());
  }

  getInstitutions() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.institutionService.getAll(params).subscribe({
      next: response => {
        this.institutions = response.data;
        this.data.load(this.institutions);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(institution?: IInstitutionClassification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      institution,
      callback: (next: boolean) => {
        if (next) this.getInstitutions();
      },
    };
    this.modalService.show(
      InstitutionClassificationDetailComponent,
      modalConfig
    );
  }

  showDeleteAlert(institution: IInstitutionClassification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(institution.id);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.institutionService.remove(id).subscribe({
      next: () => {
        this.getInstitutions();
        this.alert(
          'success',
          'Clasificación de Institución',
          'Borrado Correctamente'
        );
      },
    });
  }
}
