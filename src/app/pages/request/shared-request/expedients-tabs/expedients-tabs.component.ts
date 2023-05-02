import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expedients-tabs',
  templateUrl: './expedients-tabs.component.html',
  styles: [],
})
export class ExpedientsTabsComponent implements OnInit {
  public typeDoc: string = '';
  public updateInfo: boolean = false;
  @Input() displayName: string = '';
  @Input() docRequest: boolean = true;
  @Input() goodsDocs: boolean = true;
  @Input() generalDocs: boolean = true;
  @Input() docExp: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.requestSelected(1);
    this.updateInfo = true;
  }

  requestSelected(type: number) {
    this.typeDocumentMethod(type);
    this.updateInfo = true;
  }

  requestExpedient(type: number) {
    this.typeDocumentMethod(type);
    this.updateInfo = true;
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        this.updateInfo = true;
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        this.updateInfo = true;
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        this.updateInfo = true;
        break;
      default:
        break;
    }
  }

  selectTabData() {}
}
