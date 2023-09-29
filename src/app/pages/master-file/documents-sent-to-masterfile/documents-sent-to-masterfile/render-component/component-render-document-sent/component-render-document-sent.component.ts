import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-render-document-sent',
  templateUrl: './component-render-document-sent.component.html',
  styleUrls: ['../../documents-sent-to-masterfile.component.css'],
})
export class ComponentRenderDocumentSentComponent implements OnInit {
  //

  // Input
  @Input() rowData: any;

  //Boolean
  visibleOne: boolean = false;
  visibleTwo: boolean = false;

  //
  constructor() {}

  ngOnInit(): void {
    if (this.rowData?.scanStatus == 'ESCANEADO') {
      this.visibleOne = true;
    } else {
      this.visibleTwo = true;
    }
  }
  //

  //
}
