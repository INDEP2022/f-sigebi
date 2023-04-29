import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-show-signature-programming',
  templateUrl: './show-signature-programming.component.html',
  styles: [],
})
export class ShowSignatureProgrammingComponent
  extends BasePage
  implements OnInit
{
  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {}

  AttachDocument() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea adjuntar el documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento adjuntado correctamente', '');
        this.modalRef.content.callback(true);
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
