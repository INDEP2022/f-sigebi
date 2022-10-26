import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-jp-d-t-c-trials',
  templateUrl: './jp-d-t-c-trials.component.html',
  styles: [],
})
export class JpDTCTrialsComponent extends BasePage implements OnInit {
  data: any[];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {}
}
