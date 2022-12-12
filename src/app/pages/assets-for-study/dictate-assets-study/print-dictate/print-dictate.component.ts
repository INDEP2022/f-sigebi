import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { GenerateAutorizationComponent } from '../generate-autorization/generate-autorization.component';

@Component({
  selector: 'app-print-dictate',
  templateUrl: './print-dictate.component.html',
  styles: [],
})
export class PrintDictateComponent implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  childModal: BsModalRef;
  information: any | null = null;
  typeReport: string = '';
  isViewReport: boolean = true;

  signForm: ModelForm<any>;
  sizeCERMessage: boolean = false;
  sizeKEYMessage: boolean = false;
  fileToUpload: File | null = null;
  stateFile: string = 'No se eligio archivo';

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.information);
  }

  close(): void {
    this.openModal(
      GenerateAutorizationComponent,
      this.information,
      'dictate-assets'
    );
    this.bsModalRef.hide();
  }

  signReport(): void {
    this.isViewReport = false;
    this.initForm();
  }

  previousStep() {
    this.isViewReport = true;
  }

  sendReport() {
    console.log(this.signForm.value);
  }

  initForm() {
    this.signForm = this.fb.group({
      cer: [null],
      key: [null],
      password: [null],
    });
  }

  selectCERFile(event: any) {
    let file = event.target.files[0];
    this.stateFile = file === undefined ? 'No se eligio archivo' : '';
    let size = file.size / 2097152;
    this.sizeCERMessage = size > 2 ? true : false;
    if (this.sizeCERMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
      this.stateFile = 'Archivo cargado con éxito';
    }
  }

  selectKEYFile(event: any) {}

  openModal(component: any, information?: any, typeReport?: string) {
    let config: ModalOptions = {
      initialState: {
        informationClose: information,
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(component, config);
  }
}
