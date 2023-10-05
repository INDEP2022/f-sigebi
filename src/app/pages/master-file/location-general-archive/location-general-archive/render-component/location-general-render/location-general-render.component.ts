import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-general-render',
  templateUrl: './location-general-render.component.html',
  styleUrls: ['../../location-general-archive-component.css'],
})
export class LocationGeneralRenderComponent implements OnInit {
  //

  // Input Table Render
  @Input() value: { value: string; type: string; rowData: any };

  // Boolean
  //
  visible: boolean = false;
  visibleOne: boolean = false;
  visibleTwo: boolean = false;
  //

  //
  constructor() {}

  ngOnInit(): void {
    console.log(
      'Esta es la fila y unica xd: ',
      this.value?.rowData?.status,
      ' y este es el tipo: ',
      this.value?.type
    );
    //
    if (this.value?.type == 'battery') {
      this.visible = true;
      if (this.value?.rowData?.status === 'N') {
        this.visibleOne = true;
      } else {
        this.visibleTwo = true;
      }
    } else if (this.value?.type == 'documents') {
      this.visible = true;
      if (this.value?.rowData?.fileStatus === 'PRESTADO') {
        this.visibleTwo = true;
      } else {
        this.visibleOne = true;
      }
    }
  }
  //

  //
}
