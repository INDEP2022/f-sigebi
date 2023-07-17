import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'photo-galery',
  templateUrl: './photo-galery.component.html',
  styles: [
    `
      .photo-container {
        background-color: #f5f5f5;
        border-radius: 10px;
      }
    `,
  ],
})
export class PhotoGaleryComponent extends BasePage implements OnInit {
  @Input() goods: ITrackedGood[] = [];
  @Input() totalItems: number = 0;
  @Input() params: BehaviorSubject<ListParams>;
  @Input() override loading: boolean = false;
  @Input() formCheckbox: FormGroup;
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
