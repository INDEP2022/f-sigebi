import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-find-propose',
  templateUrl: './find-propose.component.html',
  styles: [],
})
export class FindProposeComponent extends BasePage implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
