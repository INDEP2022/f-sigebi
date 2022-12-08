import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-missing-damaged-goods',
  templateUrl: './missing-damaged-goods.component.html',
  styles: [],
})
export class MissingDamagedGoodsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    //this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      //option: [null, [Validators.required]]
    });
  }

  showInfo() {}

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
