import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { BasePage } from 'src/app/core/shared';
import {
  FileUploadEvent,
  FILE_UPLOAD_STATUSES,
} from '../interfaces/file-event';
import { FileUploadService } from '../service/file-upload.service';

export interface IUploadEvent {
  fileEvents: FileUploadEvent[];
  index?: number;
}
@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent extends BasePage implements OnInit {
  @Input() accept: string = '*';
  nameButton: string = 'Subir imágen';
  @Input() multiple = true;
  @Input() info = `Haz clic para seleccionar las imágenes o arrástralas
      aquí`;
  @Output() onUploadFiles = new EventEmitter<IUploadEvent>();
  fileEvents: FileUploadEvent[] = [];
  config: any;
  statuses = FILE_UPLOAD_STATUSES;
  @Input() uploadLoading = false;
  constructor(
    private fileUploadService: FileUploadService,
    public options: ModalOptions
  ) {
    super();
    this.config = this.options.initialState;
    if (this.config && this.config.nameButton != '') {
      this.nameButton = this.config.nameButton;
    }
  }

  ngOnInit(): void {}

  async onSelect(event: NgxDropzoneChangeEvent) {
    if (!this.multiple) {
      this.fileEvents = [];
    }
    const fileEvents = event.addedFiles.map(async file => {
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1) ?? '';
      if (ext?.toLowerCase().includes('tif')) {
        return new FileUploadEvent(file);
      }
      return file.type.includes('image')
        ? this.fileUploadService.processImage(file)
        : new FileUploadEvent(file);
    });
    fileEvents.forEach(async element => {
      this.fileEvents.push(await element);
    });
  }

  retry(event: Event, index: number) {
    event.stopPropagation();
    this.fileEvents[index].status = FILE_UPLOAD_STATUSES.PENDING;
    this.onUploadFiles.emit({
      fileEvents: this.fileEvents,
      index,
    });
  }

  onRemove(index: number) {
    this.fileEvents.splice(index, 1);
  }

  confirm() {
    if (this.fileEvents.length < 1) {
      this.alert('warning', 'Advertencia', 'Debes subir mínimo un archivo');
      return;
    }
    this.onUploadFiles.emit({
      fileEvents: this.fileEvents,
    });
  }
}
