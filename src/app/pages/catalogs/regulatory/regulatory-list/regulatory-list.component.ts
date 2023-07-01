import { Component, OnInit } from '@angular/core';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { RegulatoryService } from 'src/app/core/services/catalogs/regulatory.service';
import { RegulatoyFormComponent } from '../regulatory-form/regulatoy-form.component';
import { REGULATORY_COLUMNS } from './regulatory-columns';

@Component({
  selector: 'app-regulatory-list',
  templateUrl: './regulatory-list.component.html',
  styles: [],
})
export class RegulatoryListComponent extends BasePage implements OnInit {
  regulatorys: IRegulatory[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private regulatoryService: RegulatoryService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = REGULATORY_COLUMNS;
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
              case 'fractionId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fractionDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'number':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'validateEf':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'validateEc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
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
    this.regulatoryService.getAllDetail(params).subscribe({
      next: response => {
        this.regulatorys = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(regulatory?: IRegulatory) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      regulatory,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.BsModalService.show(RegulatoyFormComponent, modalConfig);
  }

  showDeleteAlert(regulatory?: IRegulatory) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(regulatory.id);
      }
    });
  }

  remove(id: number) {
    this.regulatoryService.remove(id).subscribe({
      next: () => {
        this.alert(
          'success',
          'Registro de regulación',
          'Borrado Correctamente'
        );
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Regulaciones',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
