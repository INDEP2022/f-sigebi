import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approve-restitution',
  templateUrl: './approve-restitution.component.html',
  styleUrls: ['./approve-restitution.component.scss'],
})
export class ApproveRestitutionComponent implements OnInit {
  title: string = 'Aprobación del bien';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  //variable para enviar los datos a verificaciones
  data: any;
  //datos para el detalle de anexo
  annexDetail: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  turnSampling() {}

  save() {}

  getSearchForm(event: any) {
    console.log(event);
  }
}
