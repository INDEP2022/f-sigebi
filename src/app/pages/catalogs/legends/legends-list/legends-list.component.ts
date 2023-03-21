import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { LegendService } from 'src/app/core/services/catalogs/legend.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { LegendFormComponent } from '../legend-form/legend-form.component';
import { LEGENDS_COLUMS } from './legends-columns';

@Component({
  selector: 'app-legends-list',
  templateUrl: './legends-list.component.html',
  styles: [],
})
export class LegendsListComponent extends BasePage implements OnInit {
  legends: ILegend[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private legendService: LegendService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LEGENDS_COLUMS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
      },
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
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
    this.legendService.getAll(params).subscribe({
      next: response => {
        this.legends = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.legends);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(LegendFormComponent, modalConfig);
  }

  showDeleteAlert(legend: ILegend) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(legend);
        this.delete(legend.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.legendService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}
