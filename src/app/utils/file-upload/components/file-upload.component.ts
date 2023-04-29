import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
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
export class FileUploadComponent implements OnInit {
  @Input() accept: string = '*';
  @Output() onUploadFiles = new EventEmitter<IUploadEvent>();
  fileEvents: FileUploadEvent[] = [];
  statuses = FILE_UPLOAD_STATUSES;
  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  async onSelect(event: NgxDropzoneChangeEvent) {
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
    this.onUploadFiles.emit({
      fileEvents: this.fileEvents,
    });
  }
}
