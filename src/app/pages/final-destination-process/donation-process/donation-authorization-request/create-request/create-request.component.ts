import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styles: [],
})
export class CreateRequestComponent extends BasePage implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
