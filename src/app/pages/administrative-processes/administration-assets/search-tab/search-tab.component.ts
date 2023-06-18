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
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly notifyService: NotificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = SEARCH_COLUMNS;
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
      noClasifBien: [null, [Validators.required]],
      noTipo: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      noSubtipo: [null, [Validators.required]],
      subtipo: [null, [Validators.required]],
      noSsubtipo: [null, [Validators.required]],
      ssubtipo: [null, [Validators.required]],
      noSssubtipo: [null, [Validators.required]],
      sssubtipo: [null, [Validators.required]],
      estatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unidadMedida: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      noDestino: [null, [Validators.required]],
      situacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      destino: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noBien: [null, [Validators.required]],
      goodDescription: [null],
      valRef: [null, [Validators.required]],
      identifica: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  getGoods(ssssubType: IGoodSssubtype) {
    this.classifGood = ssssubType.numClasifGoods;
  }

  clean() {
    this.searchTabForm.reset();
    this.list = [];
  }

  async search() {
    this.dataSearch.emit({
      data: this.searchTabForm.get('noBien').value,
      exist: true,
    });
    const respStatus = await this.searchStatus();
    const respNotification = await this.searchNotifications();
  }

  searchNotifications() {
    console.log(this.expedientNumber);
    return new Promise((res, rej) => {
      if (this.expedientNumber) {
        this.loading = true;
        this.params1.getValue()[
          'expedientNumber'
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
}
