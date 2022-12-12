import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';

@Component({
  selector: 'app-upload-documentary-support',
  templateUrl: './upload-documentary-support.component.html',
  styleUrls: ['./upload-documentary-support.component.scss'],
})
export class UploadDocumentarySupportComponent implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  information: any | null = null;
  typeReport: string = '';
  supportForm: ModelForm<any>;

  sizeMessage: boolean = false;
  fileToUpload: File | null = null;
  stateFile: string = 'No se eligio archivo';

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.supportForm = this.fb.group({
      typeAnswere: [null, Validators.required],
      observations: [null],
      //oficio respuesta
      file: [null],
      statusFileRequested: [null],
    });
  }

  downloadRequest() {}

  close() {
    this.bsModalRef.hide();
  }

  selectFile(event: any) {
    console.log(event);
    let file = event.target.files[0];
    this.stateFile = file === undefined ? 'No se eligio archivo' : '';
    let size = file.size / 2097152;
    this.sizeMessage = size > 2 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
      this.stateFile = 'Archivo cargado con éxito';
    }
  }

  cleanFileInput() {
    this.inputFile.nativeElement.value = '';
    this.stateFile = 'No se eligio archivo';
  }

  save() {}
}
