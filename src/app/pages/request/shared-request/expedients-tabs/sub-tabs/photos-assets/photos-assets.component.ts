import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
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
  warehouses = new DefaultSelect<IWarehouse>();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idRequest: number = 0;
  idGood: number = 0;
  idWarehouse: number = 0;
  columns = LIST_ASSETS_COLUMNS;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private requestservice: RequestService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
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
        editButtonContent: '<i class="fa fa-eye text-primary"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-image text-info"></i>',
      },

      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };
    this.getInfoRequest();
    this.initFilterForm();
    this.getGoodsRequest();
    this.getWarehouseSelect(new ListParams());
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
      this.loading = true;
      this.paramsGoods.getValue()['filter.requestId'] = this.idRequest;
      this.goodService.getAll(this.paramsGoods.getValue()).subscribe({
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
            item['fractionId'] = fraction.description;
          });

          Promise.all(filterGoodType).then(x => {
            this.paragraphs = data.data;
            this.totalItems = data.count;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
        },
      });
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
      management: [null],
      warehouse: [null],
    });
  }

  getWarehouseSelect(params: ListParams) {
    if (params.text) {
      alert('busca');
    } else {
      this.warehouseService.getAll(params).subscribe({
        next: response => {
          this.warehouses = new DefaultSelect(response.data, response.count);
        },
      });
    }
  }

  filter() {
    const goodNumber = this.filterForm.get('management').value;
    const warehouse = this.filterForm.get('warehouse').value;
    if (goodNumber) {
      const filter = this.paragraphs.filter(good => {
        return good.id == goodNumber;
      });
      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.onLoadToast('warning', 'No se encontro ningun bien', '');
      }
    }

    if (warehouse) {
      const filter = this.paragraphs.filter(good => {
        return good.storeId == warehouse;
      });

      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.onLoadToast('warning', 'No se encontro ningun bien', '');
      }
    }

    if (warehouse && goodNumber) {
      const filter = this.paragraphs.filter(good => {
        return good.storeId == warehouse && good.id == goodNumber;
      });

      if (filter.length > 0) {
        this.paragraphs = filter;
        this.totalItems = filter.length;
      } else {
        this.onLoadToast('warning', 'No se encontro ningun bien', '');
      }
    }
  }

  clean() {
    this.filterForm.reset();
    this.getGoodsRequest();
  }

  uploadFiles(data: any) {
    this.openModal(UploadFileComponent, data);
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
