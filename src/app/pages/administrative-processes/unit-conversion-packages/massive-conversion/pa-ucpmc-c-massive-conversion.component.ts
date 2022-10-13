import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-ucpmc-c-massive-conversion',
  templateUrl: './pa-ucpmc-c-massive-conversion.component.html',
  styles: [],
})
export class PaUcpmcCMassiveConversionComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  settings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
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
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      package: [null, [Validators.required]],
      packageType: [null, [Validators.required]],
      amountKg: [null, [Validators.required]],
      status: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      goodStatus: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      measurementUnit: [null, [Validators.required]],
      goodClassification: [null, [Validators.required]],
      targetTag: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      scanFolio: [null, [Validators.required]],
      paragraphF: [null, [Validators.required]],
      paragraphS: [null, [Validators.required]],
      paragraphL: [null, [Validators.required]],
    });

    this.form2 = this.fb.group({
      numberGood: [null, [Validators.required]],
      record: [null, [Validators.required]],
      description: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      status: [null, [Validators.required]],
      check: [false],
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
