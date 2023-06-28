import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
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
  filesToDelete: string[] = [];
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

  selectFile(image: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      this.filesToDelete.push(image);
    } else {
      this.filesToDelete = this.filesToDelete.filter(file => file != image);
    }
  }

  private getData() {
    this.filePhotoService
      .getAll(this.goodNumber + '')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.files = response;
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
    const obs = this.filesToDelete.map(filename => this.deleteFile(filename));
    forkJoin(obs).subscribe({
      complete: () => {
        // this.files = [];
        this.alert(
          'success',
          'Eliminación de Fotos',
          'Se eliminaron las fotos correctamente'
        );
        this.filesToDelete = [];
        // this.loadImages(this.goodNumber).subscribe(() => {
        //   this.updateSheets();
        // });
      },
    });
  }

  private deleteFile(name: string) {
    return this.filePhotoService.deletePhoto(this.goodNumber + '', name).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrió un error al eliminar la imagen');
        return throwError(() => error);
      })
    );
  }

  openFileUploader() {
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
