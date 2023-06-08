import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IOriginCisi } from 'src/app/core/models/catalogs/origin-cisi.model';
import { OiriginCisiService } from 'src/app/core/services/catalogs/origin-cisi.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { OrignCisiFormComponent } from '../orign-cisi-form/orign-cisi-form.component';
import { ORIGIN_CISI_COLUMNS } from './origin-cisi-columns';

@Component({
  selector: 'app-origin-cisi-list',
  templateUrl: './origin-cisi-list.component.html',
  styles: [],
})
export class OriginCisiListComponent extends BasePage implements OnInit {
  [x: string]: any;
  originCisis: IOriginCisi[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private originCisiService: OiriginCisiService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ORIGIN_CISI_COLUMNS;
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
            filter.field == 'dict_ofi' ||
            filter.field == 'areaProcess'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.originCisiService.getAll(params).subscribe({
      next: response => {
        this.originCisis = response.data;
        this.data.load(this.originCisis);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(originCisi?: IOriginCisi) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      originCisi,
      edit: !!originCisi,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(OrignCisiFormComponent, modalConfig);
  }

  showDeleteAlert(originCisi?: IOriginCisi) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(originCisi.id);
      }
    });
  }

  delete(id: number) {
    this.originCisiService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Procedencias CiSi', 'Borrado');
        this.getDeductives();
      },
      error: error => {
        this.alert(
          'warning',
          'Procedencias CiSi',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
