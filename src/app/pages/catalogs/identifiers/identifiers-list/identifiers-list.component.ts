import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { IDENTIFIER_COLUMNS } from './identifier-columns';

@Component({
  selector: 'app-identifiers-list',
  templateUrl: './identifiers-list.component.html',
  styles: [],
})
export class IdentifiersListComponent extends BasePage implements OnInit {
  paragraphs: IIdentifier[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private identifierService: IdentifierService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...IDENTIFIER_COLUMNS },
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
          this.getIdentifiers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIdentifiers());
  }

  getIdentifiers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.identifierService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(identifier?: IIdentifier) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      identifier,
      callback: (next: boolean) => {
        if (next) this.getIdentifiers();
      },
    };
    this.modalService.show(IdentifierFormComponent, modalConfig);
  }

  //Msj de alerta para borrar identificador
  showDeleteAlert(identifier: IIdentifier) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(identifier);
      }
    });
  }

  delete(identifier: IIdentifier) {
    this.identifierService.remove(identifier.id).subscribe(
      res => {
        this.alert('success', 'Identificador', 'Borrado Correctamente');
        this.getIdentifiers();
      },
      err => {
        this.alert(
          'warning',
          'Identificador',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
