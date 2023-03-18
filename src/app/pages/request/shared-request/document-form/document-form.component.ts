import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWContent } from 'src/app/core/models/ms-wcontent/wcontent.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
})
export class DocumentFormComponent extends BasePage implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  wcontent: ModelForm<IWContent>;
  typesDocuments = new DefaultSelect();
  parameter: any;
  typeDoc: string;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.parameter, this.typeDoc);

    this.prepareForm();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      ddocType: [null, [Validators.required]],
      document: [null, [Validators.required]],
      ddocTitle: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      xidSolicitud: [null],
      xidExpediente: [null],
      //numberGestion: [5296016],
      noSIAB: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: ['Metropolitana', [Validators.pattern(STRING_PATTERN)]],
      taxpayer: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      numberOffice: [null],
      transferent: [null],
      //numberProgramming: [5397],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      //programmingFolio: ['R-METROPOLITANA-SAT-5397-OS'],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getDocumentSelect(typeDocument: ListParams) {}

  getDocType(event: ListParams) {}

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas crear un nuevo documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento creado correctamente', '');

        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
