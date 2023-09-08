import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-add-and-update',
  templateUrl: './add-and-update.component.html',
  styles: [],
})
export class AddAndUpdateComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
