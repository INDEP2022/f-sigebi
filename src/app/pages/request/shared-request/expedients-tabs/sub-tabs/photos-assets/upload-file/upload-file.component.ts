import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';
import { FileUploadEvent } from 'src/app/utils/file-upload/interfaces/file-event';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [],
})
export class UploadFileComponent implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  information: any;
  fileToUpload: File | null = null;
  typeReport: string = '';
  sizeMessage: boolean = false;
  filesImages: any[] = [];
  idRequest: number = 0;
  idTrans: number = 0;
  constructor(
    private bsModalRef: BsModalRef,
    private requestService: RequestService,
    private wContentService: WContentService
  ) {}

  ngOnInit(): void {
    console.log('id solicitud', this.idRequest);
    console.log('in', this.information.id);
    this.infoRequest();
  }

  infoRequest() {
    this.requestService.getById(this.idRequest).subscribe(data => {
      this.idTrans = data.transferenceId;
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  loadImage(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    fileEvents.forEach(fileEvent => {
      this.saveImage(fileEvent);
    });
  }

  saveImage(fileEvent: FileUploadEvent) {
    this.filesImages.push(fileEvent.file);
  }

  selectFile(event: any) {
    console.log(event);
    const file: File = event.target.files[0].name;
    console.log(file);
    this.fileToUpload = file;
    /*let file = event.target.files[0];
    let size = file.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
    }*/
  }

  uploadFile() {
    const formData: Object = {};
  }
}
