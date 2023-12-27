import { Component, inject, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDictumInformation } from 'src/app/core/models/requests/dictumInformation.model';
import { CompensationService } from 'src/app/core/services/compensation-option/compensation.option';
import { RequestService } from 'src/app/core/services/requests/request.service';

@Component({
  selector: 'app-dictum-information',
  templateUrl: './dictum-information.component.html',
  styleUrls: ['./dictum-information.component.scss'],
})
export class DictumInformationComponent implements OnInit {
  dictumInfo: IDictumInformation;
  @Input() requestId: number;

  private requestService = inject(RequestService);
  private compenstionService = inject(CompensationService);

  recDoc: Object = null;

  constructor() {}

  ngOnInit(): void {
    this.getDictumInfo();
    this.getRequestInfo();
  }

  getDictumInfo() {
    // Llamar servicio para obtener informacion del dictamen
    this.dictumInfo = {
      dictumNo: '3234234',
      dictumDate: '14/09/2011',
      courtroom: '13',
      judgementNullity: '1231231',
      adminiResolutionNo: '14752',
      paymentOrderNo: '654821',
      paymentAmount: 15423,
      contributor: 'Carlos G. Palma',
      address1: 'Dirección 1 Ejemplo',
      address2: 'Dirección 2 Ejemplo',
      legalRepresentative: 'Ejemplo Representante Legal',
      requiredSatCopy: 'NO',
    };
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
          this.recDoc = resp;
          this.getAllCompensation();
        },
        error: error => {},
      });
  }

  getAllCompensation() {
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${this.requestId}`;
    this.compenstionService
      .getAllcompensation(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          console.log(resp);
          this.dictumInfo = {
            dictumNo: resp.opinionNumber,
            dictumDate: resp.opinionDate,
            courtroom: resp.veredict,
            judgementNullity: resp.nullityTrial,
            adminiResolutionNo: resp.adminResolutionNo,
            paymentOrderNo: resp.payOrderNo,
            paymentAmount: resp.amountToPay,
            contributor: this.recDoc['indicatedTaxpayer'],
            address1: resp.taxpayerDomicile,
            address2: resp.fiscalDomicile,
            legalRepresentative: resp.legalRepresentative,
            requiredSatCopy: this.val(resp.satCopy),
          };
        },
        error: error => {},
      });
  }

  val(check) {
    if (check == 1) {
      return 'SI';
    } else {
      return 'NO';
    }
  }
}
