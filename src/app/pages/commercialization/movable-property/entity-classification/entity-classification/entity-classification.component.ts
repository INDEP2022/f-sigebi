import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  columnFilters: any = [];
  totalItems: number = 0;
  origin: string = '';
  dataFactGen: LocalDataSource = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsScreen: IParamsVault = {
    PAR_MASIVO: '', // PAQUETE
  };
  @Input() PAR_MASIVO: string;
  data2 = new LocalDataSource();
  params = new BehaviorSubject(new ListParams());

  constructor(
    private typeEntityGovService: TypeEntityGovService,
    private activatedRoute: ActivatedRoute,
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
    /*  this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        this.getData();
      },
    });*/

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params2: any) => {
        console.log(params2);
        console.log(this.paramsScreen);
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params2, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params2[key] ?? null;
          }
        }
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.PAR_MASIVO) {
        this.getData();
      } else {
        console.log('SIN PARAMETROS');
        console.log(this.origin);
        if (!this.origin) {
          console.log(this.origin);
        }
      }
    }
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log('loooool');
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getData();
        }
      });

    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());

    ///////////////////////////
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    //const params = this.params.getValue().getParams();
    this.typeEntityGovService.getAllFilterv2(params).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        this.totalItems = response.count;
        console.log(this.data);
        this.dataFactGen.load(response.data);
        this.dataFactGen.refresh();
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
    this.alertQuestion('warning', '¿Desea eliminar este registro?', '').then(
      question => {
        if (question.isConfirmed) {
          this.remove(typeEntity);
        }
      }
    );
  }
  remove(typeEntity: ITypeEntityGov) {
    this.loading = true;
    const { id } = typeEntity;
    this.typeEntityGovService.remove(id).subscribe({
      next: () => {
        this.loading = false;
        this.onLoadToast('success', 'Se ha eliminado la entidad', ' ');
        this.getData();
        //location.reload();
      },
      error: () => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al eliminar la entidad'
        );
      },
    });
  }

  openModal(context?: Partial<EntityClasificationFormComponent>) {
    const modalRef = this.modalService.show(EntityClasificationFormComponent, {
      initialState: context,
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  onSaveConfirm(event: any) {
    this.onLoadToast('success', 'Se ha actualizo la entidad correctamente', '');
  }
}
export interface IParamsVault {
  PAR_MASIVO: string;
}
