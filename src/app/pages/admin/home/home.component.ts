import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
  showToast() {
    this.onLoadToast('question', 'prueba', 'prueba de alerta');
  }
}
