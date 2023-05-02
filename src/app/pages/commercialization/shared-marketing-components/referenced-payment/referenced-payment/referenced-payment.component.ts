import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-referenced-payment',
  templateUrl: './referenced-payment.component.html',
  styles: [],
})
export class ReferencedPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      bank: [null, [Validators.required]],
      from: [null, [Validators.required]],
    });
  }

  add() {
    //this.openModal();
  }

  edit(data: any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  delete(data: any) {
    console.log(data);
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
