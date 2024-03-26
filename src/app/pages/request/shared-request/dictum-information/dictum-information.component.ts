import { DatePipe } from '@angular/common';
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

  dictunNo: string = '';
  dictumDate: string = '';
  courtroom: string = '';
  judgementNullity: string = '';
  adminiResolutionNo: string = '';
  paymentOrderNo: string = '';
  paymentAmount: number = 0;
  contributor: string = '';
  address1: string = '';
  address2: string = '';
  legalRepresentative: string = '';
  requiredSatCopy: string = '';

  constructor() {}

  ngOnInit(): void {
    this.getAllCompensation();
    //this.getDictumInfo();
  }

  getDictumInfo() {
    // Llamar servicio para obtener informacion del dictamen
    this.dictumInfo = {};
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
          console.log('Este validar');
          console.log(resp);

          this.dictunNo = resp.opinionNumber;
          this.dictumDate = new DatePipe('en-US').transform(
            resp.opinionDate,
            'dd/MM/yyyy'
          );
          this.courtroom = resp.veredict;
          this.judgementNullity = resp.nullityTrial;
          this.adminiResolutionNo = resp.adminResolutionNo;
          this.paymentOrderNo = resp.payOrderNo;
          this.paymentAmount = resp.amountToPay;
          this.contributor = resp.modificationUser;
          this.address1 = resp.taxpayerDomicile;
          this.address2 = resp.fiscalDomicile;
          this.legalRepresentative = resp.legalRepresentative;
          this.requiredSatCopy = this.val(resp.satCopy);
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
