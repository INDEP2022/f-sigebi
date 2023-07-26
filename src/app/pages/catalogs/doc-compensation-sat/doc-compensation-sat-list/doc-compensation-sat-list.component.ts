import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';
import { DocCompensationSATService } from 'src/app/core/services/catalogs/doc-compesation-sat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocCompensationSatFormComponent } from '../doc-compensation-sat-form/doc-compensation-sat-form.component';
import { DOCCOMPENSATIONSAT_COLUMS } from './doc-compensation-sat-columns';

@Component({
  selector: 'app-doc-compensation-sat-list',
  templateUrl: './doc-compensation-sat-list.component.html',
  styles: [],
})
export class DocCompensationSatListComponent
  extends BasePage
  implements OnInit
{
  paragraphs: IDocCompesationSat[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private docCompesationSatService: DocCompensationSATService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DOCCOMPENSATIONSAT_COLUMS;
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
              case 'officeSatId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'typeDocSat':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'addressee':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'subjectCode':
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
    this.docCompesationSatService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(docCompesationSat?: IDocCompesationSat) {
    let config: ModalOptions = {
      initialState: {
        docCompesationSat,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocCompensationSatFormComponent, config);
  }

  showDeleteAlert(docCompesationSat: IDocCompesationSat) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(docCompesationSat.id);
      }
    });
  }
  delete(id: number) {
    this.docCompesationSatService.remove(id).subscribe({
      next: response => {
        this.alert(
          'success',
          'Documento Resarcimiento SAT',
          'Borrado Correctamente'
        ),
          this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Documento Resarcimiento SAT',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
