import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { MASS_GOODS_DELETION_COLUMNS } from './mass-goods-deletion-columns';

@Component({
  selector: 'app-mass-goods-deletion',
  templateUrl: './mass-goods-deletion.component.html',
  styles: [],
})
export class MassGoodsDeletionComponent extends BasePage implements OnInit {
  form = this.fb.group({
    expediente: [null, [Validators.required]],
    aver: [null, [Validators.required]],
    causa: [null, [Validators.required]],
    acta: [null, [Validators.required]],
    amparo: [null, [Validators.required]],
    toca: [null, [Validators.required]],
    identificador: [null, [Validators.required]],
  });
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = MASS_GOODS_DELETION_COLUMNS;
  }

  ngOnInit(): void {}
}
