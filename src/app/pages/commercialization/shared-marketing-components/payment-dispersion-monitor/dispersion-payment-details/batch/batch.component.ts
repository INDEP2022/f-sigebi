import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styles: [],
})
export class BatchComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = [
    {
      batch: '1008',
      customerTaxId: 'ACM030407M3A',
      description: 'Vehículo apto para circulación',
      status: 'VEND',
      warranty: 180000,
      advance: 50000,
      address: 'KM 1.0 Carr',
    },
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  definitive: boolean = false;
  total: number = 105666395.52;
  warranty: number = 0.0;
  amountL: number = 633983.31;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null],
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

  runScatter(): void {
    this.alertQuestion(
      'question',
      'Ejecutar',
      'Desea ejecutar el proceso de dispersión?'
    )
      .then(question => {
        if (question.isConfirmed) {
          //console.log('Ejecutado')
        } else {
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  definitiveChange($event: any): void {
    //console.log(this.definitive)
  }
}
