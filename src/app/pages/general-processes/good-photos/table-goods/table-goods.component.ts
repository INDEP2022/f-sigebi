import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { FilePhotoSaveZipService } from 'src/app/core/services/ms-ldocuments/file-photo-save-zip.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
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
  @Input() selectedGoodsForPhotos: number[] = [];
  @ViewChild('table') table: ElementRef;
  toggleInformation = true;
  selecteds = 0;
  constructor(
    private goodFinderService: GoodFinderService,
    private modalService: BsModalService,
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
    this.service = this.goodFinderService;
  }

  userRowSelect(row: any) {
    console.log(row);
    console.log(this.table);
  }

  download() {}

  openZipUploader() {
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: '.zip',
        uploadFiles: false,
        service: this.filePhotoSaveZipService,
        identificator: this.selectedGoodsForPhotos,
        multiple: false,
        titleFinishUpload: 'Imagenes Cargadas Correctamente',
        questionFinishUpload: '¿Desea subir más imagenes?',
        callback: (refresh: boolean) => {
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
    if (this.selectedGoodsForPhotos && this.selectedGoodsForPhotos.length > 0) {
      newColumnFilters['filter.id'] = '$in:' + this.selectedGoodsForPhotos;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
