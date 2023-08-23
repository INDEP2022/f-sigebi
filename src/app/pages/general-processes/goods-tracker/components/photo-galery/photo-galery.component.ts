import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { BasePage } from 'src/app/core/shared';
import { GoodsTableService } from '../goods-table/goods-table.service';
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
  constructor(
    private goodsTableService: GoodsTableService,
    private rotuer: Router
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.formCheckbox.value);
  }

  goToAdmin(good: ITrackedGood) {
    this.goodsTableService.stateFlag.next();
    this.rotuer.navigate(
      ['/pages/administrative-processes/administration-assets'],
      {
        queryParams: {
          goodNumber: good.id,
          origin: 'FCONGENRASTREADOR',
        },
      }
    );
  }
}
