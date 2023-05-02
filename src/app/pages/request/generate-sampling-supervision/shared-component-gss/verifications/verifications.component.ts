import { Component, Input, OnInit } from '@angular/core';

var data = [
  {
    id: 1,
    description:
      'Recepción  documental, electronica y validacion de Requisitos (17%)',
    observation: 'LA DOCUMENTACION DEL BIEN ES INCORRECTA',
    selected: true,
  },
  {
    id: 2,
    description: 'Resguardo de expediente (25%)',
    observation: '',
    selected: false,
  },
];

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.scss'],
})
export class VerificationsComponent implements OnInit {
  @Input() data: any;
  listVerifications: any[] = [];
  verificationsSelected: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.listVerifications = data;
  }

  checkList(event: any, data: any) {
    if (event.target.checked == true) {
      this.verificationsSelected.push(data);
    } else {
      let index = this.verificationsSelected.indexOf(
        this.listVerifications.find(x => x.id == data.id)
      );
      this.verificationsSelected.splice(index, 1);
    }
    console.log(this.verificationsSelected);
  }
}
