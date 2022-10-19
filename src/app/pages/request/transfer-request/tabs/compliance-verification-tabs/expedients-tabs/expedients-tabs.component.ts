import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expedients-tabs',
  templateUrl: './expedients-tabs.component.html',
  styles: [
  ]
})
export class ExpedientsTabsComponent implements OnInit {
  public typeDoc: string = '';

  constructor() {
   }

  ngOnInit(): void {
    this.requestSelected(1);
  }

  requestSelected(event: any) {
    this.typeDoc = "request"
    console.log(event);
    
  }

  requestExpedient(event: any) {
    this.typeDoc = "expedient"
    console.log(event);
    
  }

}
