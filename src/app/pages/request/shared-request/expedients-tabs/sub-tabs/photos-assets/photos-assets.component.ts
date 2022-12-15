import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
  totalItems: number = 0;

  columns = LIST_ASSETS_COLUMNS;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
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
    let config: ModalOptions = {
      initialState: {
        information: data,
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
