import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { SiabClasificationDetailComponent } from '../siab-clasification-detail/siab-clasification-detail.component';
import { SIAB_COLUMNS } from './siab-columns';

@Component({
  selector: 'app-siab-clasification-list',
  templateUrl: './siab-clasification-list.component.html',
  styles: [],
})
export class SiabClasificationListComponent extends BasePage implements OnInit {
  clasifications: ISiabClasification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private siabClasificationService: SIABClasificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SIAB_COLUMNS;
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
            filter.field == 'typeId' ||
            filter.field == 'typeDescription' ||
            filter.field == 'subtypeId' ||
            filter.field == 'subtypeDescription' ||
            filter.field == 'ssubtypeId' ||
            filter.field == 'ssubtypeDescription' ||
            filter.field == 'sssubtypeId' ||
            filter.field == 'sssubtypeDescription' ||
            filter.field == 'creationUser' ||
            filter.field == 'editionUser' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getSiabClasifications();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSiabClasifications());
  }

  getSiabClasifications() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.siabClasificationService.getAll(params).subscribe({
      next: response => {
        this.clasifications = response.data;
        this.data.load(this.clasifications);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(clasification?: ISiabClasification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      clasification,
      callback: (next: boolean) => {
        if (next) this.getSiabClasifications();
      },
    };
    this.modalService.show(SiabClasificationDetailComponent, modalConfig);
  }

  showDeleteAlert(clasification: ISiabClasification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(clasification.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.siabClasificationService.removeCatalogSiabClasification(id).subscribe({
      next: () => this.getSiabClasifications(),
    });
  }
}
