import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-new-document-form',
  templateUrl: './new-document-form.component.html',
  styleUrls: ['./new-document-form.component.scss'],
})
export class NewDocumentFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  documentForm: ModelForm<any>;
  fileToUpload: File | null = null;
  sizeMessage: boolean = false;

  typeDocSelected = new DefaultSelect();
  stateSelected = new DefaultSelect();
  typeTranferSelected = new DefaultSelect();
  regionalDelegationSelected = new DefaultSelect();

  //datos pasados por el modal
  data: string = '';
  typeComponent: string = '';
  isDisable: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeComponent);
    /*if (this.typeComponent === 'verify-noncompliance') {
      this.isDisable = false;
    }*/
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  initForm(): void {
    this.documentForm = this.fb.group({
      typeDoc: [null],
      noDoc: [null],
      titleDoc: [null],
      noAsset: [{ value: null, disabled: true }],
      responsible: [null],
      noSiab: [null],
      contributor: [null],
      regionalDelegation: [{ value: '', disabled: this.isDisable }],
      noOfice: [null],
      state: [null],
      noProgramming: [null],
      typeTranfer: [null],
      programmingFolio: [null],
      sender: [null],
      comments: [null],
      senderCharge: [null],
      //author: [null],
      //version: [null],
    });
  }

  selectFile(event: any): void {
    this.fileToUpload = event.target.files[0];
    let size = this.fileToUpload.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
      return;
    } else {
      console.log(this.fileToUpload);
    }
  }

  getTypeDocSelect(event: any) {}

  getStateSelect(event: any) {}

  getTypeTranferSelect(event: any) {}

  getRegionalDelegationSelect(event: any) {}

  close(): void {
    this.modalRef.hide();
  }

  save() {
    this.messageSuccess();
  }

  messageSuccess() {
    const message = 'Documento agregado exitosamente con el id: SEA022455';
    Swal.fire({
      icon: undefined,
      title: 'Información',
      text: message,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
      footer: '',
    });
  }
}
