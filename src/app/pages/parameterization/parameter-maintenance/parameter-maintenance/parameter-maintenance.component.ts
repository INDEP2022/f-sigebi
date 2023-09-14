import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSPARAMETER } from '../columns';
import { ParameterFormComponent } from '../parameter-form/parameter-form.component';

@Component({
  selector: 'app-parameter-maintenance',
  templateUrl: './parameter-maintenance.component.html',
  styles: [
    '::ng-deep .values{white-space: break-spaces;overflow-wrap: break-word;width: 242px;}',
  ],
})
export class ParameterMaintenanceComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  parameterData: any[] = [];
  searchFilter: SearchBarFilter;
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;

  constructor(
    private parameter: ParameterCatService,
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
      columns: { ...COLUMNSPARAMETER },
    };

    this.searchFilter = { field: 'id', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'startDate':
                console.log('dddd', filter.search);
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                console.log('ddddccc', filter.search);

                break;
              case 'endDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log('this.param:', this.params);
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getPagination();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getPagination();
    });
  }

  private getPagination() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.parameter.getAllWithFilters(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.parameterData = resp.data;
        this.data.load(this.parameterData);
        this.data.refresh();
        this.totalItems = resp.count || 0;
        this.loading = false;
      },
      error: err => {
        //this.onLoadToast('error', err.error.message, '');
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  public openForm(parameter?: IParameters, edit?: boolean) {
    console.log(parameter);
    let config: ModalOptions = {
      initialState: {
        parameter,
        edit,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ParameterFormComponent, config);
  }

  deleteParameter(event: any) {
    console.log(event.id);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameter.remove(event.id).subscribe({
          next: () => (
            this.onLoadToast(
              'success',
              'Parámetro',
              'Ha sido eliminado correctamente'
            ),
            this.getPagination()
          ),
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      }
    });
  }
}
