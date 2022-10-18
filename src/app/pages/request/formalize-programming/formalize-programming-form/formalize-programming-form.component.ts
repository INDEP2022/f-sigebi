import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
