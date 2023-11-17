import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IParameterComer } from 'src/app/core/models/catalogs/parameter-comer.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelsFormComponent } from '../models-form/models-form.component';
import { ModelsService } from '../models.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styles: [],
})
export class ModelsListComponent extends BasePage implements OnInit {
  parameterComer: IParameterComer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  select: IParameterComer;
  searchText: string = '';
  modelName: string;

  constructor(
    private modalService: BsModalService,
    private modelServices: ModelsService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = true;
    this.settings.actions.position = 'right';
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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'modelComment':
                searchFilter = SearchFilter.ILIKE;
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
          this.getModels();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getModels());
  }

  rowsSelected(event: any) {
    this.select = event.data;
  }

  getModels() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.modelServices.getAll(params).subscribe({
      next: response => {
        this.parameterComer = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Modal para crear o editar clientes penalizados
  openForm(parameterComer?: IParameterComer) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      parameterComer,
      callback: (next: boolean) => {
        if (next) this.getModels();
      },
    };
    this.modalService.show(ModelsFormComponent, modalConfig);
  }

  showDeleteAlert(parameterComer?: IParameterComer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Modelo?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(parameterComer.id);
      }
    });
  }

  delete(id: number) {
    this.modelServices.remove(id).subscribe({
      next: () => {
        this.getModels();
        this.alert('success', 'El modelo ha sido eliminado', '');
      },
    });
  }
}
