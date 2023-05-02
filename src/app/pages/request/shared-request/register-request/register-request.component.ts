import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IRequestInformation } from 'src/app/core/models/requests/requestInformation.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-register-request',
  templateUrl: './register-request.component.html',
  styles: [],
})
export class RegisterRequestComponent extends BasePage implements OnInit {
  title: string = '';
  layout: string = ''; // 'step' para solicitudes que se turnan y 'single' para solicitudes que finalizan en este paso
  requestType: string = '';
  subject: Observable<string> = of('');
  requestId: number = NaN;
  requestInfo: IRequestInformation;
  public typeDoc: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('layout')) {
        this.layout = params.get('layout');
      }
      if (params.get('type')) {
        this.requestType = params.get('type');
        this.getTypeInfo(this.requestType);
      }
      if (params.get('request')) {
        this.requestId = parseInt(params.get('request'));
        this.getRequestInfo(this.requestId);
      }
    });
    this.requestSelected(1);
  }

  getTypeInfo(type: string) {
    // Llamar servicio para obtener informacion estatica de registro segun el tipo de solicitud
    switch (this.requestType) {
      case 'destination-information':
        this.subject = of('SOLICITUD DE INFORMACIÓN DEL DESTINO DEL BIEN');
        break;

      case 'forfeiture':
        this.subject = of('PUESTA A DISPOSICIÓN DE BIENES DECOMISADOS');
        break;

      case 'abandonment':
        this.subject = of('PROCESO DE ABANDONO');
        break;

      case 'extinction':
        this.subject = of(
          'DOCUMENTACIÓN COMPLEMENTARIA DE EXPEDIENTES EXTINCIÓN DE DOMINIO'
        );
        break;

      default:
        break;
    }
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
    switch (this.requestType) {
      case 'destination-information':
        this.title = `INFORMACIÓN DE BIENES: Registo de Documentación Complementaria, No. Solicitud: ${this.requestId}`;
        break;

      case 'forfeiture':
        this.title = `DECOMISO: SOlicitud de Documentación Complementaria, No. Solicitud: ${this.requestId}`;
        break;

      case 'abandonment':
        this.title = `ABANDONO: Registro de Documentación Complementaria, No. Solicitud: ${this.requestId}`;
        break;

      case 'extinction':
        this.title = `EXTINCIÓN DE DOMINIO: Registro de Documentación Complementaria, No. Solicitud: ${this.requestId}`;
        break;

      default:
        break;
    }
  }

  close() {
    // this.registRequestForm.reset();
    this.router.navigate(['pages/request/list']);
  }

  requestRegistered(request: any) {}

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

  endRequest() {
    this.alertQuestion(
      'question',
      `¿Desea finalizar la solicitud con Folio ${this.requestId}`,
      '',
      'Finalizar'
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud finalizada con éxito', '');
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
