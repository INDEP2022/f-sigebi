import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../../shared/components/select/default-select';
import { LIST_ASSETS_COLUMNS } from './columns/list-assets-columns';
import { OpenPhotosComponent } from './open-photos/open-photos.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@Component({
  selector: 'app-photos-assets',
  templateUrl: './photos-assets.component.html',
  styleUrls: ['./photos-assets.component.scss'],
})
export class PhotosAssetsComponent extends BasePage implements OnInit {
  parentRef: BsModalRef;
  showSearchFilter: boolean = true;
  filterForm: ModelForm<any>;
  typeGoods = new DefaultSelect<IWarehouse>();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idRequest: number = 0;
  idGood: number = 0;
  idWarehouse: number = 0;
  columns = LIST_ASSETS_COLUMNS;
  formLoading: boolean = false;
  allDataGood: IGood[] = [];
  task: any;
  statusTask: any;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private typeRelevantService: TypeRelevantService,
    private requestservice: RequestService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));
    console.log('task', this.task);

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;
    console.log('statustask', this.statusTask);

    this.showHideErrorInterceptorService.showHideError(false);
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        delete: true,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent: '<i class="fa fa-eye text-primary mx-2" > Ver</i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-image text-info mx-2"> Subir</i>',
      },

      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };
    this.getInfoRequest();
    this.initFilterForm();
    this.getTypeRelevant(new ListParams());
    this.getGoodsRequest();
  }

  getInfoRequest() {
    this.requestservice.getById(this.idRequest).subscribe({
      next: response => {
        this.idWarehouse = response.keyStateOfRepublic;
      },
    });
  }

  getGoodsRequest() {
    if (this.idRequest) {
      this.params.getValue()['filter.requestId'] = this.idRequest;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: async (data: any) => {
          const filterGoodType = data.data.map(async (item: any) => {
            const goodType = await this.getGoodType(item.goodTypeId);
            item['goodTypeId'] = goodType;
            item['requestId'] = this.idRequest;

            if (item['physicalStatus'] == 1) item['physicalStatus'] = 'BUENO';
            if (item['physicalStatus'] == 2) item['physicalStatus'] = 'MALO';
            if (item['stateConservation'] == 1)
              item['stateConservation'] = 'BUENO';
            if (item['stateConservation'] == 2)
              item['stateConservation'] = 'MALO';
            if (item['destiny'] == 1) item['destiny'] = 'VENTA';

            const fraction = item['fractionId'];
            item['fractionId'] = fraction?.description;
          });

          Promise.all(filterGoodType).then(x => {
            this.paragraphs = data.data;
            this.allDataGood = this.paragraphs;
            this.totalItems = data.count;
          });
        },
        error: error => {},
      });
    } else {
    }
  }

  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantService.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      management: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      typeGood: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getTypeRelevant(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeGoods = new DefaultSelect(data.data, data.count);
      },
    });
  }

  filter() {
    const goodNumber = this.filterForm.get('management').value;
    const typeGood = this.filterForm.get('typeGood').value;

    if (!goodNumber && !typeGood) {
      this.getGoodsRequest();
    }

    if (goodNumber) {
      const filter = this.allDataGood.filter(good => {
        return good.id == goodNumber;
      });
      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.paragraphs = filter;
        this.onLoadToast('warning', 'No se encontró ningún bien', '');
      }
    }

    if (typeGood) {
      const filter = this.allDataGood.filter(good => {
        return good.goodTypeId == typeGood;
      });

      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.paragraphs = filter;
        this.onLoadToast('warning', 'No se encontró ningún bien', '');
      }
    }

    if (typeGood && goodNumber) {
      const filter = this.allDataGood.filter(good => {
        return good.goodTypeId == typeGood && good.id == goodNumber;
      });

      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.onLoadToast('warning', 'No se encontró ningún bien', '');
      }
    }
  }

  clean() {
    this.filterForm.reset();
    this.getGoodsRequest();
  }

  uploadFiles(data: any) {
    let loadingPhotos = 0;
    const idRequest = this.idRequest;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      statusTask: this.statusTask,
      data,
      idRequest,
      callBack: (next: boolean) => {
        if (next) {
          this.formLoading = true;
          loadingPhotos = loadingPhotos + 1;
          setTimeout(() => {
            this.getGoodsRequest();
            this.formLoading = false;
          }, 7000);
          if (loadingPhotos == 1) {
            this.onLoadToast('success', 'Imagen cargada correctamente', '');
          }
        }
      },
    };
    this.modalService.show(UploadFileComponent, config);
  }

  openPhotos(data: any) {
    this.openModal(OpenPhotosComponent, data);
  }

  openModal(component: any, data?: any): void {
    const idRequest = this.idRequest;
    let config: ModalOptions = {
      initialState: {
        information: data,
        idRequest,
        callback: (next: boolean) => {
          if (next) {
            this.getGoodsRequest();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }
}
