import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IConfigvtadmun } from 'src/app/core/models/ms-parametercomer/configvtadmum.model';
import { ConfigvtadmunService } from 'src/app/core/services/ms-parametercomer/configvtadmun.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { PageSetupModalComponent } from '../page-setup-modal/page-setup-modal.component';
import { PAGE_SETUP_COLUMNS } from './page-setup-columns';

@Component({
  selector: 'app-page-setup',
  templateUrl: './page-setup.component.html',
  styles: [],
})
export class PageSetupComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject(new FilterParams());
  data: IConfigvtadmun[] = [];
  dataFactGen: LocalDataSource = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsScreen: IParamsVault = {
    PAR_MASIVO: '', // PAQUETE
  };
  origin: string = '';
  columnFilters: any = [];
  @Input() PAR_MASIVO: string;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private configvtadmunService: ConfigvtadmunService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: {
        ...PAGE_SETUP_COLUMNS,
        visualiza: {
          title: 'Visualizar',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (visualiza: string) =>
            visualiza == '1' ? true : false,
          renderComponent: CheckboxElementComponent<IConfigvtadmun>,
          onComponentInitFunction: (
            instance: CheckboxElementComponent<IConfigvtadmun>
          ) => this.onVisualizaChange(instance),
        },
      },
    };
  }

  ngOnInit(): void {
    /* this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getData(),
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
              case 'aliascol':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'aliastab':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'idColumn':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'idTable':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'ordencol':
                searchFilter = SearchFilter.EQ;
                break;
              case 'ordentab':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'visualiza':
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
  }

  openForm(pageSetup?: IConfigvtadmun) {
    this.openModal({ pageSetup });
  }

  confirmDelete(pageSetup: IConfigvtadmun) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar Esta Configuración De Columnas?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(pageSetup);
      }
    });
  }

  remove(pageSetup: IConfigvtadmun) {
    this.loading = true;
    const { idColumn, idTable } = pageSetup;
    this.configvtadmunService.remove({ idColumn, idTable }).subscribe({
      next: () => {
        this.loading = false;
        this.onLoadToast(
          'success',
          'Configuración De Columnas',
          'Eliminada Correctamente'
        );
        this.getData();
      },
      error: () => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio Un Error Al Eliminar La Configuración De Columnas'
        );
      },
    });
  }

  onVisualizaChange(checkboxEl: CheckboxElementComponent<IConfigvtadmun>) {
    checkboxEl.toggle
      .pipe(
        takeUntil(this.$unSubscribe),
        map(data => {
          const { row, toggle } = data;
          return { ...row, visualiza: toggle ? '1' : '0' };
        }),
        switchMap(config => this.updateConfig(config))
      )
      .subscribe();
  }

  openModal(context?: Partial<PageSetupModalComponent>) {
    const modalRef = this.modalService.show(PageSetupModalComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    // const params = this.params.getValue().getParams();
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    this.configvtadmunService.getAllFilter(params).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        console.log(this.data);
        this.totalItems = response.count;
        this.dataFactGen.load(response.data);
        this.dataFactGen.refresh();
      },
      error: error => (this.loading = false),
    });
  }

  updateConfig(config: Partial<IConfigvtadmun>) {
    this.loading = true;
    return this.configvtadmunService.update(config).pipe(
      catchError(error => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio Un Error Al Actualizar La Configuración De Columnas'
        );
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.onLoadToast(
          'success',
          'Configuración De Columnas',
          'Actualizada Correctamente'
        );
        this.getData();
      })
    );
  }
}

export interface IParamsVault {
  PAR_MASIVO: string;
}
