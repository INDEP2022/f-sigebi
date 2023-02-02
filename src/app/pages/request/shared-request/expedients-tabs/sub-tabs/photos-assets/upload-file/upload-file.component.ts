import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [],
})
export class UploadFileComponent implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  fileToUpload: File | null = null;
  typeReport: string = '';
  sizeMessage: boolean = false;

  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  close(): void {
    this.bsModalRef.hide();
  }

  selectFile(event: any) {
    console.log(event);
    const file: File = event.target.files;
    console.log(file);
    /*let file = event.target.files[0];
    let size = file.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
    }*/
  }
}
