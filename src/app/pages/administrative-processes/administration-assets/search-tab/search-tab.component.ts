import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { OpenPhotosComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/photos-assets/open-photos/open-photos.component';
import { SEARCH_COLUMNS } from './search-columns';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styles: [],
})
export class SearchTabComponent extends BasePage implements OnInit {
  searchTabForm: ModelForm<any>;
  @Output() dataSearch = new EventEmitter<{ data: any; exist: boolean }>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  list: any[] = [];
  classifGood: number;
  expedientNumber: string | number;
  goodSelect: IGood;
  cleanGood: boolean = false;
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly notifyService: NotificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = SEARCH_COLUMNS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchTabForm.get('noBien').valueChanges.subscribe({
      next: val => {
        this.searchTabForm.get('estatus').setValue('');
      },
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
    /* this.searchTabForm.get('noClasifBien').setValue('');
    this.searchTabForm.get('noTipo').setValue('');
    this.searchTabForm.get('tipo').setValue('');
    this.searchTabForm.get('noSubtipo').setValue('');
    this.searchTabForm.get('subtipo').setValue('');
    this.searchTabForm.get('noSsubtipo').setValue('');
    this.searchTabForm.get('ssubtipo').setValue('');
    this.searchTabForm.get('noSssubtipo').setValue('');
    this.searchTabForm.get('sssubtipo').setValue('');
    this.searchTabForm.get('estatus').setValue('');
    this.searchTabForm.get('situacion').setValue('');
    this.searchTabForm.get('destino').setValue('');
    this.cleanGood = true; */
    this.searchTabForm.reset();
    this.list = [];
    this.dataSearch.emit({
      data: this.searchTabForm.get('noBien').value,
      exist: false,
    });
  }

  async search() {
    /* if (
      this.searchTabForm.get('subtipo').value === '' ||
      this.searchTabForm.get('subtipo').value === null
    ) {
      this.onLoadToast('info', 'Debe seleccionar un subtipo');
      return;
    }
    if (
      this.searchTabForm.get('ssubtipo').value === '' ||
      this.searchTabForm.get('ssubtipo').value === null
    ) {
      this.onLoadToast('info', 'Debe seleccionar un ssubtipo');
      return;
    } */
    if (
      this.searchTabForm.get('noBien').value === '' ||
      this.searchTabForm.get('noBien').value === null
    ) {
      this.onLoadToast('info', 'Debe seleccionar un bien');
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
    console.log(this.expedientNumber);
    return new Promise((res, rej) => {
      if (this.expedientNumber) {
        this.loading = true;
        this.params1.getValue()[
          'filter.expedientNumber'
        ] = `$eq:${this.expedientNumber}`;
        this.notifyService.getAllListParams(this.params1.getValue()).subscribe({
          next: data => {
            this.list = data.data;
            this.totalItems = data.count;
            this.loading = false;
            console.log('ESTA ES LA LISTA DE NOTIFICACIONES', this.list);
          },
          error: err => (this.loading = false),
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
      this.onLoadToast('info', 'Debe seleccionar un bien');
      return;
    }
    const data = {
      id: this.searchTabForm.get('noBien').value,
    };
    this.openModal(OpenPhotosComponent, data);
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
    console.log(fechaFormateada);
    return fechaFormateada;
  }

  onChangeGood(event: IGood) {
    console.log(event);
    this.goodSelect = event;
  }
}
