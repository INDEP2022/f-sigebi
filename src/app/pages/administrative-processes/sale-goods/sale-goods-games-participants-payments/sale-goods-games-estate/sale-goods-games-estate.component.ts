import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SALEGOODSGAMESESTATE_COLUMNS } from './sale-goods-games-estate-columns';

@Component({
  selector: 'app-sale-goods-games-estate',
  templateUrl: './sale-goods-games-estate.component.html',
  styles: [],
})
export class SaleGoodsGamesEstateComponent extends BasePage implements OnInit {
  estateForm: ModelForm<any>;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SALEGOODSGAMESESTATE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.estateForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      store: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      vault: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      proceedings: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeEstate: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subSubType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subSubSubType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
