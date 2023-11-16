import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { MassiveFilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/massive-file-photo-save-zip.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { GoodPhotosService } from 'src/app/pages/general-processes/good-photos/services/good-photos.service';
import { LIST_ASSETS_COLUMNS_GOODFINDER } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/photos-assets/columns/list-assets-columns';
import { OpenPhotosComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/photos-assets/open-photos/open-photos.component';
import { UploadZipImagesComponent } from '../upload-zip-images/upload-zip-images.component';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styles: [],
})
export class UploadImagesComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs = new LocalDataSource();
  totalItems: number = 0;
  goodSelect: IGood[] = [];
  constructor(
    private modalService: BsModalService,
    private goodFinderService: GoodFinderService,
    private dataService: GoodPhotosService,
    private massiveFilePhotoSaveZipService: MassiveFilePhotoSaveZipService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        delete: false,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent:
          '<i class="fa fa-eye tooltip="Ver" containerClass="tooltip-style" text-primary mx-2" ></i>',
      },
      selectMode: '',
      columns: LIST_ASSETS_COLUMNS_GOODFINDER,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsRequest());
  }

  getGoodsRequest() {
    this.loading = true;
    this.goodFinderService.goodFinder(this.params.getValue()).subscribe({
      next: data => {
        this.paragraphs.load(data.data);
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  goodsSelect(good: IGood[]) {
    this.goodSelect = good;
  }

  loadImages() {
    if (this.goodSelect.length == 1) {
      console.log('good', this.goodSelect);

      const config = {
        ...MODAL_CONFIG,
        initialState: {
          accept: '.zip',
          uploadFiles: false,
          service: this.massiveFilePhotoSaveZipService,
          multiple: false,
          titleFinishUpload: 'Imagenes Cargadas Correctamente',
          questionFinishUpload: '¿Desea subir más imagenes?',
          callback: (refresh: boolean) => {
            if (refresh) {
              this.dataService.showEvent.next(true);
            }
            // console.log(refresh);
            // this.fileUploaderClose(refresh);
          },
        },
      };
      this.modalService.show(UploadZipImagesComponent, config);
    } else {
      this.alert('warning', 'Acción Invalida', 'Selecciona al menos un bien');
    }
  }

  openPhotos(data: any) {
    this.openModal(OpenPhotosComponent, data);
  }

  openModal(component: any, data?: any): void {
    //const idRequest = this.idRequest;
    let config: ModalOptions = {
      initialState: {
        information: data,
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
