import { Component, Input, OnInit } from '@angular/core';
import { IDictumInformation } from 'src/app/core/models/requests/dictumInformation.model';

@Component({
  selector: 'app-dictum-information',
  templateUrl: './dictum-information.component.html',
  styleUrls: ['./dictum-information.component.scss'],
})
export class DictumInformationComponent implements OnInit {
  dictumInfo: IDictumInformation;
  @Input() requestId: number;

  constructor() {}

  ngOnInit(): void {
    this.getDictumInfo();
  }

  getDictumInfo() {
    // Llamar servicio para obtener informacion del dictamen
    this.dictumInfo = {
      dictumNo: 3234234,
      dictumDate: '14/09/2011',
      courtroom: 13,
      judgementNullity: 1231231,
      adminiResolutionNo: 14752,
      paymentOrderNo: 654821,
      paymentAmount: 15423,
      contributor: 'Carlos G. Palma',
      address1: 'Dirección 1 Ejemplo',
      address2: 'Dirección 2 Ejemplo',
      legalRepresentative: 'Ejemplo Representante Legal',
      requiredSatCopy: 'NO',
    };
  }
}
