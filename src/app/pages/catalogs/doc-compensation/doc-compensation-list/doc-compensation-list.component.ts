import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocCompensation } from 'src/app/core/models/catalogs/doc-compensation.model';
import { DocCompensationService } from 'src/app/core/services/catalogs/doc-compensation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocCompensationFormComponent } from '../doc-compensation-form/doc-compensation-form.component';
import { DOC_COMPENSATION_COLUMNNS } from './doc-compensation-columns';

@Component({
  selector: 'app-doc-compensation-list',
  templateUrl: './doc-compensation-list.component.html',
  styles: [],
})
export class DocCompensationListComponent extends BasePage implements OnInit {
  docCompensation: IDocCompensation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private docCompensationService: DocCompensationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DOC_COMPENSATION_COLUMNNS;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'satTypeJob':
                searchFilter = SearchFilter.EQ;
                break;
              case 'type':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idTypeDocSat':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idTypeDocSatXml':
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
          this.getDocCompensation();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocCompensation());
  }

  getDocCompensation() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.docCompensationService.getAll(params).subscribe({
      next: response => {
        this.docCompensation = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(docCompensation?: IDocCompensation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      docCompensation,
      callback: (next: boolean) => {
        if (next) this.getDocCompensation();
      },
    };
    this.modalService.show(DocCompensationFormComponent, modalConfig);
  }

  showDeleteAlert(docCompensation: IDocCompensation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(docCompensation.id);
      }
    });
  }

  delete(id: number) {
    this.docCompensationService.removeCatalogDocCompensation(id).subscribe({
      next: response => {
        this.alert(
          'success',
          'Documento Resarcimiento',
          'Borrado Correctamente'
        ),
          this.getDocCompensation();
      },
      error: err => {
        this.alert(
          'warning',
          'Documento Resarcimiento',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
