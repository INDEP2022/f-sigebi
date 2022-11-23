import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-results',
  templateUrl: './verify-results.component.html',
  styles: [],
})
export class VerifyResultsComponent implements OnInit {
  title: string = 'Recisión Resultados 758';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  turnSampling() {}

  getSearchForm(event: any) {}
}
