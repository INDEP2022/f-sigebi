import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilePhotoEditService } from 'src/app/core/services/ms-ldocuments/file-photo-edit.service';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { NO_IMAGE_FOUND, PhotoClassComponent } from '../../models/photo-class';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent extends PhotoClassComponent implements OnInit {
  @Output() refreshFiles = new EventEmitter<boolean>();
  // subscription: any;
  constructor(
    private service: FilePhotoService,
    private editService: FilePhotoEditService
  ) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filename']) {
      this.filenameChange();
    }
  }

  private filenameChange() {
    this.loading = true;
    let index = this.filename.indexOf('F');
    console.log(index);
    this.service
      .getById(this.goodNumber, +this.filename.substring(index + 1, index + 5))
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.error = false;
          this.base64Change(base64);
          console.log(this.error);
        },
        error: error => {
          // this.alert('error', 'Fotos', 'Ocurrio un error al cargar la foto');
          this.loading = false;
          this.error = true;
          console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  editPhoto() {
    const index = this.filename.indexOf('F');
    this.editService.consecNumber = +this.filename.substring(
      index + 1,
      index + 5
    );
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        accept: 'image/*',
        uploadFiles: false,
        service: this.editService,
        multiple: false,
        info: `Haz clic para seleccionar la imágen o arrástrala
      aquí`,
        titleFinishUpload: 'Imagen cargada correctamente',
        questionFinishUpload: '¿Desea seguir editando?',
        identificator: this.goodNumber + '',
        callback: (refresh: boolean) => {
          console.log(refresh);
          this.refreshFiles.emit(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }
}
