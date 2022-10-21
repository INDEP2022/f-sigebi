import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
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
      delegation: [null, Validators.required],
      store: [null, Validators.required],
      vault: [null, Validators.required],
      proceedings: [null, Validators.required],
      typeEstate: [null, Validators.required],
      subType: [null, Validators.required],
      subSubType: [null, Validators.required],
      subSubSubType: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
