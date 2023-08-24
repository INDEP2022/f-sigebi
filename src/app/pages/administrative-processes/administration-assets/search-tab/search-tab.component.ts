import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SEARCH_COLUMNS } from './search-columns';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styles: [],
})
export class SearchTabComponent extends BasePage implements OnInit {
  searchTabForm: ModelForm<any>;
  @Output() dataSearch = new EventEmitter<{ data: any; exist: boolean }>();
  //params = new BehaviorSubject<FilterParams>(new FilterParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  list: any[] = [];
  classifGood: number;
  expedientNumber: string | number;
  goodSelect: IGood;
  cleanGood: boolean = false;
  data: LocalDataSource = new LocalDataSource();
  dataGoods: any[] = [];
  goods = new DefaultSelect<IGood>();
  columnFilters: any = [];
  reloadGood: IGood;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  isDisabled: boolean = false;
  queryParams: boolean = false;
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly notifyService: NotificationService,
    private modalService: BsModalService,
    private router: Router,
    private service: GoodFinderService,
    private route: ActivatedRoute
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = SEARCH_COLUMNS;
    this.settings.hideSubHeader = false;
  }

  async ngOnInit() {
    this.prepareForm();
    const form = localStorage.getItem('formSearch');
    this.route.queryParams.subscribe(async params => {
      if (params['goodNumber']) {
        this.searchTabForm.get('noBien').setValue(params['goodNumber']);
        this.goodSelect = await this.getGood();
        this.reloadGood = this.goodSelect;
        //console.error(this.goodSelect);
        this.queryParams = true;
        this.search();
      }
    });
    if (form) {
      const newForm = JSON.parse(form);
      this.searchTabForm.get('noBien').setValue(newForm.noBien);
      localStorage.removeItem('formSearch');
      this.queryParams = false;
      this.goodSelect = await this.getGood();
      this.reloadGood = this.goodSelect;
      //console.error(this.goodSelect);
      this.search();
    }
    this.getGoodsSheard(new ListParams());
    this.searchTabForm.get('noBien').valueChanges.subscribe({
      next: val => {
        this.searchTabForm.get('estatus').setValue('');
      },
    });
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'wheelNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'receiptDate':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'captureDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'indiciadoNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expedientNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'affairKey':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              this.params1.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.searchNotifications();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchNotifications());
  }

  private prepareForm() {
    this.searchTabForm = this.fb.group({
      noClasifBien: [null],
      noTipo: [null],
      tipo: [null],
      noSubtipo: [null],
      subtipo: [null],
      noSsubtipo: [null],
      ssubtipo: [null],
      noSssubtipo: [null],
      sssubtipo: [null],
      estatus: [null, [Validators.pattern(STRING_PATTERN)]],
      unidadMedida: [null],
      cantidad: [null],
      noDestino: [null],
      situacion: [null, [Validators.pattern(STRING_PATTERN)]],
      destino: [null, [Validators.pattern(STRING_PATTERN)]],
      noBien: [null, [Validators.required]],
      goodDescription: [null],
      valRef: [null],
      identifica: [null, [Validators.pattern(STRING_PATTERN)]],
      descripcion: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getGoods(ssssubType: IGoodSssubtype) {
    if (ssssubType !== null) {
      this.classifGood = ssssubType.numClasifGoods;
      this.getGoodsSheard({ limit: 10, page: 1 });
      // this.searchTabForm.controls['noBien'].enable();
      this.goods = new DefaultSelect([], 0, true);
      this.params = new BehaviorSubject<FilterParams>(new FilterParams());
      console.log(this.classifGood);
    } else {
      this.classifGood = null;
    }
  }
  getGoodType(data: any) {
    if (data !== null) {
      console.log(data);
      // this.searchTabForm.controls['noBien'].disable();
    }
  }
  clean() {
    this.searchTabForm.reset();
    this.data.load([]);
    this.data.refresh();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.classifGood = null;
    this.getGoodsSheard({ limit: 10, page: 1 });
    this.dataSearch.emit({
      data: this.searchTabForm.get('noBien').value,
      exist: false,
    });
  }

  async search() {
    if (
      this.searchTabForm.get('noBien').value === '' ||
      this.searchTabForm.get('noBien').value === null
    ) {
      this.alert('warning', 'Datos Búsqueda', 'Debe Seleccionar un Bien', '');
      return;
    }
    this.dataSearch.emit({
      data: this.searchTabForm.get('noBien').value,
      exist: true,
    });

    const respStatus = await this.searchStatus();
    if (respStatus == false) {
      this.alert('warning', 'El Bien no cuenta con un estatus valido', '');
      return;
    } else {
      const respNotification = await this.searchNotifications();
    }
    if (this.goodSelect) {
      this.searchTabForm.get('situacion').patchValue(this.goodSelect.situation);
      this.searchTabForm.get('destino').patchValue(this.goodSelect.destiny);
    }
    /* if (this.reloadGood) {
      this.searchTabForm.get('situacion').patchValue(this.reloadGood.situation);
      this.searchTabForm.get('destino').patchValue(this.reloadGood.destiny);
    } */
  }

  searchNotifications() {
    return new Promise((res, rej) => {
      console.log('Bien select', this.goodSelect);
      if (this.goodSelect) {
        this.loading = true;
        this.params1.getValue()[
          'filter.expedientNumber'
        ] = `$eq:${this.goodSelect.fileNumber}`;
        let params = {
          ...this.params1.getValue(),
          ...this.columnFilters,
        };
        this.notifyService.getAllListParams(params).subscribe({
          next: data => {
            this.list = data.data;
            this.data.load(data.data);
            this.data.refresh();
            this.totalItems = data.count;
            this.loading = false;
            res(true);
          },
          error: err => {
            this.data.load([]);
            this.data.refresh();
            this.loading = false;
            res(false);
          },
        });
      }
    });
  }

  searchStatus() {
    return new Promise((res, rej) => {
      this.goodService
        .getStatusByGood(this.searchTabForm.get('noBien').value)
        .subscribe({
          next: data => {
            this.searchTabForm
              .get('estatus')
              .patchValue(data.status_descripcion);
            this.expedientNumber = data.expedientNumber;
            res(data.status_descripcion);
          },
          error: err => res(false),
        });
    });
  }

  openPhotos() {
    if (
      this.searchTabForm.get('noBien').value === '' ||
      this.searchTabForm.get('noBien').value === null
    ) {
      this.alert('warning', 'Datos Búsqueda', 'Debe Seleccionar un Bien');
      return;
    }
    const array: any[] = [this.searchTabForm.get('noBien').value];
    localStorage.setItem('selectedGoodsForPhotos', JSON.stringify(array));
    localStorage.setItem(
      'formSearch',
      JSON.stringify(this.searchTabForm.value)
    );
    const route: string = 'pages/general-processes/good-photos';
    this.router.navigate([route], {
      queryParams: {
        numberGood: this.searchTabForm.get('noBien').value,
        origin: 'FACTADBREGCOMBIEN',
      },
    });
  }

  openModal(component: any, data?: any): void {
    //const idRequest = this.idRequest;
    let config: ModalOptions = {
      initialState: {
        information: data,
        request: false,
        callback: (next: boolean) => {
          if (next) {
            // this.getGoodsRequest();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }

  onChangeGood(event: IGood) {
    console.log(event);
    this.goodSelect = event;
  }

  getGood() {
    return new Promise<any>((res, rej) => {
      this.goodService
        .getById(this.searchTabForm.get('noBien').value)
        .subscribe({
          next: (response: any) => {
            res(response.data[0]);
          },
          error: err => res(null),
        });
    });
  }
  getGoodsSheard(params: ListParams) {
    //Provisional data
    console.log(params);
    // this.searchTabForm.controls['noBien'].disable();

    this.loader.load = true;
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    console.log('CLASIFICADOR DEL BEINE ES: ', this.classifGood);
    if (this.classifGood) {
      data.addFilter('goodClassNumber', this.classifGood);
    }
    if (!isNaN(parseFloat(params.text)) && isFinite(+params.text)) {
      if (params.text != undefined && params.text != '') {
        data.addFilter('id', params.text, SearchFilter.EQ);
      }
    } else {
      if (params.text != undefined && params.text != '') {
        data.addFilter('description', params.text, SearchFilter.ILIKE);
      }
    }
    this.service.getAll2(data.getParams()).subscribe({
      next: data => {
        // this.dataGoods = data.data.map(clasi => {
        //   return {
        //     ...clasi,
        //     info: `${clasi.id} - ${clasi.description ?? ''}`,
        //   };
        // });
        this.goods = new DefaultSelect(data.data, data.count);
        this.loader.load = false;
        // this.searchTabForm.controls['noBien'].enable();
      },
      error: err => {
        this.goods = new DefaultSelect([], 0, true);
        let error = '';
        this.loader.load = false;
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        //   this.onLoadToast('error', 'Error', error);
        // }
        // this.alert(
        //   'warning',
        //   'Información',
        //   'No hay bienes que mostrar con los filtros seleccionado'
        // );
      },
      complete: () => {
        this.searchTabForm.updateValueAndValidity();
      },
    });
  }
  goToRastreador() {
    this.router.navigate(['/pages/general-processes/goods-tracker']);
  }
}
