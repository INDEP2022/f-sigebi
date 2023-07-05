import { Component, Input, OnInit } from '@angular/core';
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
        border: 1px solid #aeb6bf;
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
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
