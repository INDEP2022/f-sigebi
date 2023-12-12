import { Component, inject, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-register-documentation-view',
  templateUrl: './register-documentation-view.component.html',
  styleUrls: ['./register-documentation-view.component.scss'],
})
export class RegisterDocumentationViewComponent
  extends BasePage
  implements OnInit
{
  @Input() requestId: number;
  requestDoc: IRequest;
  transference: number = null;
  processDetonate: string = '';
  isPriority: boolean = false;
  typeExpedient: string = '';
  affair: string = '';
  originInfo: string = '';
  @Input() process?: string = '';

  //INJECTIONS
  private requestService = inject(RequestService);
  private genericsService = inject(GenericService);
  private affairService = inject(AffairService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log('request-docu-view', this.requestId);
    if (this.requestId) this.getRequestInfo();
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion de la documentacion de la solicitud
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.requestId}`;
    this.requestService
      .getAll(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          this.transference = +resp.transferenceId;
          this.isPriority = resp.urgentPriority == 'Y' ? true : false;
          this.getOriginInfo(resp.originInfo);
          this.getTypeExpedient(resp.typeRecord);
          this.getAffair(resp.affair);
          this.requestDoc = resp;
        },
      });
  }

  getTypeExpedient(id: number | string) {
    if (!id) return;
    const params = new ListParams();
    params['filter.name'] = '$eq:Tipo Expediente';
    params['filter.keyId'] = `$eq:${id}`;
    this.genericsService
      .getAll(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe((data: any) => {
        this.typeExpedient = data.description;
      });
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.affair = data.description;
        this.processDetonate = data.processDetonate;
      },
    });
  }

  getOriginInfo(id: number | string) {
    if (!id) return;
    const params = new ListParams();
    params['filter.name'] = '$eq:Procedencia';
    params['filte.keyId'] = `$eq:${id}`;
    this.genericsService
      .getAll(params)
      .pipe(map(x => x.data[0]))
      .subscribe((data: any) => {
        this.originInfo = data.description;
      });
  }

  showInput(comp) {
    let input = [];
    console.log('ESTE ES MI PROCESO' + this.process);
    switch (this.process) {
      case 'register-request-return':
      case 'verify-compliance-return':
      case 'approve-return':
        input = ['trialType', 'authorityOrdering', 'crime'];
        break;
      case 'register-request-similar-goods':
      case 'notify-transfer-similar-goods':
      case 'eye-visit-similar-goods':
      case 'validate-eye-visit-similar-goods':
      case 'response-letter-similar-goods':
        input = ['trialType', 'crime'];
        break;
      case 'register-request-compensation':
      case 'review-guidelines-compensation':
      case 'analysis-result-compensation':
      case 'validate-opinion-compensation':
      case 'notification-taxpayer-compensation':
        input = ['trialType', 'crime'];
        break;
      case 'register-request-information-goods':
      case 'respose-office-information-goods':
      case 'review-office-information-goods':
        input = ['trialType', 'crime'];
        break;
      case 'register-request-economic-compensation':
      case 'request-economic-resources':
      case 'review-economic-guidelines':
      case 'generate-results-economic-compensation':
      case 'validate-dictum-economic':
      case 'delivery-notify-request':
      case 'register-taxpayer-date':
      case 'register-pay-order':
      case 'generate-compensation-act':
        input = ['trialType', 'crime'];
        break;
      case 'register-request-protection':
      case 'protection-regulation':
      case 'review-result-protection':
      case 'register-compensation-documentation':
        input = ['protectNumber', 'crime', 'trialType'];
        break;
    }

    return input.includes(comp);
  }
}
