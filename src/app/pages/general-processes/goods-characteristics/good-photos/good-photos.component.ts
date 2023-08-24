import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilePhotoService,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { BasePage } from 'src/app/core/shared';
import { GoodsCharacteristicsService } from '../services/goods-characteristics.service';

@Component({
  selector: 'app-good-photos',
  templateUrl: './good-photos.component.html',
  styleUrls: ['./good-photos.component.scss'],
})
export class GoodPhotosComponent extends BasePage implements OnInit {
  @Input() showPhoto: boolean;
  @Input() disabledBienes: boolean;
  @Input()
  get goodNumber() {
    return this._goodNumber;
  }
  set goodNumber(value) {
    this._goodNumber = value;
    if (value) {
      this.getData();
    }
  }
  lastConsecutive: number = 1;
  filesToDelete: IPhotoFile[] = [];
  private _goodNumber: string | number;
  constructor(
    private service: GoodsCharacteristicsService,
    private filePhotoService: FilePhotoService,
    private modalService: BsModalService
  ) {
    super();
  }

  get files() {
    return this.service.files;
  }

  set files(value) {
    this.service.files = value;
  }

  ngOnInit() {}

  selectFile(image: IPhotoFile, event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.filesToDelete.push(image);
    } else {
      this.filesToDelete = this.filesToDelete.filter(file => file != image);
    }
  }

  private getData() {
    this.lastConsecutive = 1;
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.files = [...response];
            const last = response[response.length - 1];
            const index = last.name.indexOf('F');
            this.lastConsecutive += +last.name.substring(index + 1, index + 5);
          }
        },
      });
  }

  async confirmDelete() {
    if (this.filesToDelete.length < 1) {
      this.alert(
        'warning',
        'Advertencia',
        'Debes seleccionar mínimo un archivo'
      );
      return;
    }
    const result = await this.alertQuestion(
      'warning',
      'Advertencia',
      '¿Estás seguro que desea eliminar las imágenes seleccionadas?'
    );

    if (result.isConfirmed) {
      this.deleteSelectedFiles();
    }
  }

  private deleteSelectedFiles() {
    const obs = this.filesToDelete.map(file => {
      const index = file.name.indexOf('F');
      return this.deleteFile(+file.name.substring(index + 1, index + 5));
    });
    forkJoin(obs).subscribe({
      complete: () => {
        // this.files = [];
        this.alert(
          'success',
          'Eliminación de Fotos',
          'Se Eliminaron las Fotos Correctamente'
        );
        this.filesToDelete = [];
        this.getData();
      },
    });
  }

  private deleteFile(consecNumber: number) {
    return this.filePhotoService
      .deletePhoto(this.goodNumber + '', consecNumber)
      .pipe(
        catchError(error => {
          this.alert(
            'error',
            'Error',
            'Ocurrió un error al eliminar la imagen'
          );
          return throwError(() => error);
        })
      );
  }

  openFileUploader() {
    // this.filePhotoService.consecNumber = this.lastConsecutive;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: 'image/*',
        uploadFiles: false,
        service: this.filePhotoService,
        identificator: this.goodNumber + '',
        callback: (refresh: boolean) => {
          console.log(refresh);
          this.fileUploaderClose(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }

  fileUploaderClose(refresh: boolean) {
    if (refresh) {
      this.getData();
      // this.loadImages(this.folio).subscribe(() => {
      //   this.updateSheets();
      // });
    }
  }
}
