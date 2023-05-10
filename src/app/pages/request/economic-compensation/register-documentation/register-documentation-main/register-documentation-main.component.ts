import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequestInformation } from '../../../../../core/models/requests/requestInformation.model';

@Component({
  selector: 'app-register-documentation-main',
  templateUrl: './register-documentation-main.component.html',
  styles: [],
})
export class RegisterDocumentationMainComponent
  extends BasePage
  implements OnInit
{
  requestId: number = NaN;
  requestInfo: IRequestInformation;
  public typeDoc: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('request')) {
        this.requestId = parseInt(params.get('request'));
        this.getRequestInfo(this.requestId);
      }
    });
    this.requestSelected(1);
  }

  getRequestInfo(rquestId: number) {
    // Llamar servicio para obtener informacion de la solicitud
    this.requestInfo = {
      date: '17-abr-2018',
      requestNo: 1896,
      fileNo: 15499,
      memorandumNo: 54543,
      regionalDelegation: 'BAJA CALIFORNIA',
      state: 'BAJA CALIFORNIA',
      transferee: 'SAT - COMERCIO EXTERIOR',
      emitter: 'ALAF',
      authority: 'ADMINISTRACIÓN LOCAL DE AUDITORÍA FISCAL DE MEXICALI',
    };
  }

  close() {
    // this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  requestRegistered(request: any) {
    console.log(request);
  }

  turnRequest() {
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestId}?`,
      '',
      'Turnar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }

  requestSelected(type: number) {
    this.typeDocumentMethod(type);
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        break;
      default:
        break;
    }
  }
}
