import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/file-photo-save-zip.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { GoodPhotosService } from '../services/good-photos.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-table-goods',
  templateUrl: './table-goods.component.html',
  styleUrls: ['./table-goods.component.scss'],
})
export class TableGoodsComponent
  extends BasePageWidhtDinamicFiltersExtra
  implements OnInit
{
  @Input() selectedGoodsByQueryParams: number[] = [];
  @Input() set reset(value: number) {
    if (value > 0) {
      this.data.setFilter([], true, false);
      this.getData();
    }
  }
  @ViewChild('table') table: ElementRef;
  goodTemp: any;
  toggleInformation = true;
  selecteds = 0;
  constructor(
    private modalService: BsModalService,
    private dataService: GoodPhotosService,
    private filePhotoSaveZipService: FilePhotoSaveZipService
  ) {
    super();
    // this.haveInitialCharge = false;
    this.ilikeFilters = [
      'description',
      'descriptionDelegation',
      'descriptionSubdelegation',
    ];
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: null,
    };
    this.service = this.dataService;
  }

  userRowSelect(row: any) {
    console.log(row.data);
    console.log(this.table);
    this.goodTemp = row.data;
  }

  get selectedGood() {
    return this.dataService.selectedGood;
  }

  set selectedGood(value) {
    this.dataService.selectedGood = value;
  }

  get selectedGoods() {
    return this.dataService.selectedGoods;
  }

  showPhotos() {
    this.selectedGood = this.goodTemp;
    this.dataService.showEvent.next(true);
  }

  download() {}

  override async extraOperationsGetData() {
    this.items = await this.data.getAll();
  }

  openZipUploader() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: '.zip',
        uploadFiles: false,
        service: this.filePhotoSaveZipService,
        identificator: this.selectedGoods,
        multiple: false,
        titleFinishUpload: 'Imagenes Cargadas Correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
          if (refresh && this.selectedGoods.includes(this.selectedGood.id)) {
            this.dataService.showEvent.next(true);
          }
          // console.log(refresh);
          // this.fileUploaderClose(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (
      this.selectedGoodsByQueryParams &&
      this.selectedGoodsByQueryParams.length > 0
    ) {
      newColumnFilters['filter.id'] = '$in:' + this.selectedGoodsByQueryParams;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
