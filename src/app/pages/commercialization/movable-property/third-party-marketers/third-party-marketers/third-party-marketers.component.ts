import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, skip, takeUntil, tap } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Columns
import {
  COMI_XTHIRC_COLUMNS,
  THIRD_COLUMNS,
  TYPE_EVENT_THIRD_COLUMNS,
} from './columns';
//Services
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IComiXThird,
  IThirdParty,
  ITypeEventXtercomer,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComiXThirdService } from 'src/app/core/services/ms-thirdparty/comi-xthird.service';
import { TypeEventXterComerService } from 'src/app/core/services/ms-thirdparty/type-events-xter-comer.service';
import { AmountThirdModalComponent } from '../amount-third-modal/amount-third-modal.component';
import { ThirdPartyModalComponent } from '../third-party-modal/third-party-modal.component';
import { TypeEventModalComponent } from '../type-event-modal/type-event-modal.component';

@Component({
  selector: 'app-third-party-marketers',
  templateUrl: './third-party-marketers.component.html',
  styles: [],
})
export class ThirdPartyMarketersComponent extends BasePage implements OnInit {
  data: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  thirdPartyList: LocalDataSource = new LocalDataSource();
  typeEventList: LocalDataSource = new LocalDataSource();
  amountList: LocalDataSource = new LocalDataSource();
  // thirdPartyList: IThirdParty[] = [];
  // typeEventList: ITypeEventXtercomer[] = [];
  // amountList: IComiXThird[] = [];

  thirPartys: IThirdParty;
  typeEvents: ITypeEventXtercomer;
  amounts: IComiXThird;

  settings2;
  settings3;

  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];

  loading2: boolean = false;
  loading3: boolean = false;

  constructor(
    private thirdPartyService: ThirdPartyService,
    private typeEventXterComerService: TypeEventXterComerService,
    private comiXThirdService: ComiXThirdService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...THIRD_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...TYPE_EVENT_THIRD_COLUMNS },
    };

    this.settings3 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COMI_XTHIRC_COLUMNS },
    };
  }

  ngOnInit(): void {
    // TERCEROS COMERCIALIZADORES //
    this.thirdPartyList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              id: () => (searchFilter = SearchFilter.EQ),
              nameReason: () => (searchFilter = SearchFilter.ILIKE),
              calculationRoutine: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getThirdPartyAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getThirdPartyAll());

    // TIPOS DE EVENTOS QUE ATIENDE EL TERCERO
    this.getTypeEventFilters();

    // MONTOS //
    this.getAmountsFilters();
  }

  // TIPOS DE EVENTOS QUE ATIENDE EL TERCERO //
  getTypeEventFilters() {
    this.typeEventList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              thirdPartyId: () => (searchFilter = SearchFilter.EQ),
              typeEventId: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          //Su respectivo metodo de busqueda de datos
          this.getTypeEvent(this.thirPartys);
        }
      });
    this.params2
      .pipe(
        skip(1),
        tap(() => {
          this.getTypeEvent(this.thirPartys);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  // MONTOS //
  getAmountsFilters() {
    this.thirdPartyList
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              goodId: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              quantity: () => (searchFilter = SearchFilter.EQ),
              acta_: () => (searchFilter = SearchFilter.ILIKE),
              status: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getThirdPartyAll();
        }
      });
    this.params
      .pipe(
        skip(1),
        tap(() => {
          this.getTypeEvent(this.thirPartys);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  // --------------------------------------------------------------------- //

  getThirdPartyAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.thirdPartyService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartyList.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    // this.typeEventList = [];
    this.thirPartys = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTypeEvent(this.thirPartys));
  }

  getTypeEvent(thirdParty?: IThirdParty) {
    this.loading2 = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.typeEventXterComerService
      .getById(thirdParty.id)
      .pipe(
        map((data2: any) => {
          let list: IListResponse<ITypeEventXtercomer> =
            {} as IListResponse<ITypeEventXtercomer>;
          const array2: ITypeEventXtercomer[] = [{ ...data2 }];
          list.data = array2;
          return list;
        })
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.typeEventList.load(response.data);
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.loading2 = false),
      });
  }

  rowsSelected2(event: any) {
    this.totalItems3 = 0;
    // this.amountList = [];
    this.typeEvents = event.data;
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAmount(this.typeEvents));
  }

  getAmount(typeEvent?: ITypeEventXtercomer) {
    this.loading3 = true;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    this.comiXThirdService.getById(typeEvent.thirdPartyId).subscribe({
      next: response => {
        console.log(response);
        this.amountList.load(response.data);
        this.totalItems3 = response.count;
        this.loading3 = false;
      },
      error: error => (this.loading3 = false),
    });
  }

  openForm1(thirPartys?: IThirdParty) {
    let config: ModalOptions = {
      initialState: {
        thirPartys,
        callback: (next: boolean) => {
          if (next) this.getThirdPartyAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ThirdPartyModalComponent, config);
  }

  openForm2(typeEvents?: ITypeEventXtercomer) {
    let config: ModalOptions = {
      initialState: {
        typeEvents,
        callback: (next: boolean) => {
          if (next) this.getThirdPartyAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeEventModalComponent, config);
  }

  openForm3(amounts?: IComiXThird) {
    let config: ModalOptions = {
      initialState: {
        amounts,
        callback: (next: boolean) => {
          if (next) this.getThirdPartyAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AmountThirdModalComponent, config);
  }
}
