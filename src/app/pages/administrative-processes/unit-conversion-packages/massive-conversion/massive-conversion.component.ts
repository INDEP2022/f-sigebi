import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { MassiveConversionPermissionsComponent } from '../massive-conversion-permissions/massive-conversion-permissions.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-massive-conversion',
  templateUrl: './massive-conversion.component.html',
  styles: [],
})
export class MassiveConversionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: true },
      columns: COLUMNS,
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
      scanFolio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      paragraphF: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphS: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphL: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.form2 = this.fb.group({
      numberGood: [null, [Validators.required]],
      record: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      unit: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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
  openPermissions(data: any) {
    // let config: ModalOptions = {
    //   initialState: {
    //     data,
    //     callback: (next: boolean) => { },
    //   },
    //   class: 'modal-xl modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // };
    // this.modalService.show(MassiveConversionPermissionsComponent, config);
    const modalRef = this.modalService.show(
      MassiveConversionPermissionsComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
