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
import {
  FilePhotoService,
  IPhotoFile,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';
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

  get filename() {
    return this.file.name;
  }

  get user() {
    const file = this.file as IPhotoFile;
    return file.usuario_creacion ?? null;
  }

  get loggedUser() {
    return localStorage.getItem('username').toUpperCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes['file']) {
      this.filenameChange();
    }
  }

  private filenameChange() {
    this.loading = true;
    // console.log(this.filename);
    let index = this.file.name.indexOf('F');
    let finish = this.file.name.indexOf('.');
    // console.log(index);
    this.service
      .getById(this.goodNumber, +this.file.name.substring(index + 1, finish))
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: base64 => {
          this.base64 = base64;
          this.loading = false;
          this.error = false;
          this.base64Change(base64);
          // console.log(this.error);
        },
        error: error => {
          // this.alert('error', 'Fotos', 'Ocurrio un error al cargar la foto');
          this.loading = false;
          this.error = true;
          // console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }

  editPhoto() {
    if (this.user && this.user !== this.loggedUser) {
      this.alert(
        'warning',
        'No puede editar una foto registrada por otro usuario',
        ''
      );
      return;
    }
    const index = this.file.name.indexOf('F');
    let finish = this.file.name.indexOf('.');
    this.editService.consecNumber = +this.file.name.substring(
      index + 1,
      finish
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
        titleFinishUpload: 'Imagen Cargada Correctamente',
        questionFinishUpload: '¿Desea seguir editando?',
        identificator: this.goodNumber + '',
        callback: (refresh: boolean) => {
          // console.log(refresh);
          this.refreshFiles.emit(refresh);
        },
      },
    };
    this.modalService.show(FileUploadModalComponent, config);
  }
}
