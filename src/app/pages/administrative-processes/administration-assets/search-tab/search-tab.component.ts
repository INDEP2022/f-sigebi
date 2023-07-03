import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly notifyService: NotificationService,
    private modalService: BsModalService,
    private readonly router: Router
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = SEARCH_COLUMNS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    const form = localStorage.getItem('formSearch');
    console.log(form);

    if (form) {
      const newForm = JSON.parse(form);
      console.log(newForm.noBien);
      this.searchTabForm.get('noBien').setValue(newForm.noBien);
      this.search();
      localStorage.removeItem('formSearch');
    }

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
    } else {
      this.classifGood = null;
    }
  }

  clean() {
    this.searchTabForm.reset();
    this.list = [];
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
      this.alert('warning', 'Datos Búsqueda', 'Debe seleccionar un bien', '');
      return;
    }
    this.dataSearch.emit({
      data: this.searchTabForm.get('noBien').value,
      exist: true,
    });
    const respStatus = await this.searchStatus();
    this.searchTabForm.get('situacion').patchValue(this.goodSelect.situation);
    this.searchTabForm.get('destino').patchValue(this.goodSelect.destiny);
    const respNotification = await this.searchNotifications();
  }

  searchNotifications() {
    return new Promise((res, rej) => {
      if (this.expedientNumber) {
        this.loading = true;
        this.params1.getValue()[
          'filter.expedientNumber'
        ] = `$eq:${this.expedientNumber}`;
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
          },
          error: err => {
            this.data.load([]);
            this.data.refresh();
            this.loading = false;
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
        });
    });
  }

  openPhotos() {
    if (
      this.searchTabForm.get('noBien').value === '' ||
      this.searchTabForm.get('noBien').value === null
    ) {
      this.alert('warning', 'Datos Búsqueda', 'Debe seleccionar un bien');
      return;
    }
    const array: any[] = [this.searchTabForm.get('noBien').value];
    localStorage.setItem('selectedGoodsForPhotos', JSON.stringify(array));
    localStorage.setItem(
      'formSearch',
      JSON.stringify(this.searchTabForm.value)
    );
    const route: string = 'pages/general-processes/good-photos';
    this.router.navigate([route]);
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
    // this.searchTabForm.get('noBien').setValue(event.id);
    this.goodSelect = event;
  }
}
