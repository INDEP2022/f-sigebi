import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { TABLE_SETTINGS } from '../../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../../shared/components/select/default-select';
import { LIST_ASSETS_COLUMNS } from './columns/list-assets-columns';
import { OpenPhotosComponent } from './open-photos/open-photos.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

var data = [
  {
    id: 1,
    noManagement: 1232,
    noRequest: 323,
    typeAsset: 'bien',
    uniqueKey: 22,
    quantity: 2,
    transferDescription:
      'PRENSADORA DE LAMINA PARA CARROCERAI DE SEDANES 4000 TON DE PRESION',
    destinityLigie: 'VENTA',
    phisicState: 'BUENE',
    stateConsercation: 'BUENE',
    fraction: '1937',
  },
];

@Component({
  selector: 'app-photos-assets',
  templateUrl: './photos-assets.component.html',
  styleUrls: ['./photos-assets.component.scss'],
})
export class PhotosAssetsComponent extends BasePage implements OnInit {
  parentRef: BsModalRef;
  showSearchFilter: boolean = true;
  filterForm: ModelForm<any>;
  typeAssetSelected = new DefaultSelect();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idRequest: number = 0;
  columns = LIST_ASSETS_COLUMNS;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private goodTypeService: GoodTypeService,
    private typeRelevantService: TypeRelevantService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };
    this.columns.actions = {
      ...this.columns.actions,
      onComponentInitFunction: (instance?: any) => {
        instance.btn1click.subscribe((data: any) => {
          this.openPhotos(data);
        }),
          instance.btn2click.subscribe((data: any) => {
            this.uploadFiles(data);
          });
      },
    };
    this.initFilterForm();
    this.getGoodsRequest();
  }

  getGoodsRequest() {
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
          this.totalItems = data.data;
          this.paragraphs = data.data;
          this.loading = false;
        });
      },
    });

    /*.subscribe(data => {
      const requestChange = data.data.map(items => {
        items.requestId = this.idRequest;
        return items;
      });

      console.log('cambiar', requestChange);
      requestChange.map(items => {
        console.log(items.goodTypeId);
        this.goodTypeService.getById({
          next: async (data:any) => 
        })
      });
      this.paragraphs = requestChange;
      this.totalItems = data.count; 
    }); */
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
      typeAsset: [null],
    });
  }

  getTypeAsset(event: any) {}

  filter() {
    console.log(this.filterForm.getRawValue());
    this.paragraphs = data;
  }

  clean() {
    this.filterForm.reset();
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
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    /*this.bsModelRef.content.event.subscribe((res: any) => {
      // cargarlos en el formulario
      console.log(res);
    });*/
  }
}
