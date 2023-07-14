import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'commer-packages-lots',
  templateUrl: './commer-packages-lots.component.html',
  styles: [],
})
export class CommerPackagesLotsComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
