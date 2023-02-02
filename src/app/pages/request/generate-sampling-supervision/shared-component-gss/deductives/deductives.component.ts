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
  selector: 'app-deductives',
  templateUrl: './deductives.component.html',
  styles: [],
})
export class DeductivesComponent implements OnInit {
  @Input() typeTask: string = '';
  listVerifications: any[] = [];
  verificationsSelected: any[] = [];
  isReadonly: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.setEnableInputs();
    this.listVerifications = data;
  }

  setEnableInputs(): void {
    if (this.typeTask === 'verify-warehouse-assets') {
      this.isReadonly = true;
    } else if (this.typeTask === 'assets-classification') {
      this.isReadonly = true;
    }
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
