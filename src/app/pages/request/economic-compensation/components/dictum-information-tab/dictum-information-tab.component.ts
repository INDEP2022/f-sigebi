import { Component, Input, OnInit } from '@angular/core';
import { IDictumInformation } from './../../../../../core/models/requests/dictumInformation.model';

@Component({
  selector: 'app-dictum-information-tab',
  templateUrl: './dictum-information-tab.component.html',
  styleUrls: ['./dictum-information-tab.component.scss'],
})
export class DictumInformationTabComponent implements OnInit {
  dictumInfo: IDictumInformation;
  @Input() requestId: number;

  constructor() {}

  ngOnInit(): void {
    this.getDictumInfo();
  }

  getDictumInfo() {
    // Llamar servicio para obtener informacion del dictamen
  }
}
