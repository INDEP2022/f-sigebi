import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeEntityGov } from 'src/app/core/models/ms-parametercomer/type-entity-gov.model';
import { TypeEntityGovService } from 'src/app/core/services/ms-parametercomer/type-entity-gov.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EntityClasificationFormComponent } from '../components/entity-clasification-form/entity-clasification-form.component';
import { ENTITY_CLASS_COLUMNS } from './entity-classification-columns';

@Component({
  selector: 'app-entity-classification',
  templateUrl: './entity-classification.component.html',
  styles: [],
})
export class EntityClassificationComponent extends BasePage implements OnInit {
  //params = new BehaviorSubject(new FilterParams());
  data: ITypeEntityGov[] = [];
  totalItems: number = 0;
  data2 = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject(new ListParams());

  constructor(
    private typeEntityGovService: TypeEntityGovService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: true,
      },
      columns: ENTITY_CLASS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        this.getData();
      },
    });
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //const params = this.params.getValue().getParams();
    this.typeEntityGovService.getAllFilterv2(params).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        this.totalItems = response.count;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  changePagin() {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  edit(typeEntity?: ITypeEntityGov) {
    this.openModal({ typeEntity });
  }

  confirmDelete(typeEntity?: ITypeEntityGov) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(typeEntity);
      }
    });
  }
  remove(typeEntity: ITypeEntityGov) {
    this.loading = true;
    const { id } = typeEntity;
    this.typeEntityGovService.remove(id).subscribe({
      next: () => {
        this.loading = false;
        this.onLoadToast('success', 'Registro eliminado', '');
        this.getData();
      },
      error: () => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al eliminar el registro'
        );
      },
    });
  }

  openModal(context?: Partial<EntityClasificationFormComponent>) {
    const modalRef = this.modalService.show(EntityClasificationFormComponent, {
      initialState: context,
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  onSaveConfirm(event: any) {
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
}
