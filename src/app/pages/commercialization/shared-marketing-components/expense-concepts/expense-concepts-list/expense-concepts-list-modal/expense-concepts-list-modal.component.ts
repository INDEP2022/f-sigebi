import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { ConceptsService } from 'src/app/core/services/ms-commer-concepts/concepts.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ExpenseConceptsService } from '../../services/expense-concepts.service';

@Component({
  selector: 'app-expense-concepts-list-modal',
  templateUrl: './expense-concepts-list-modal.component.html',
  styleUrls: ['./expense-concepts-list-modal.component.scss'],
})
export class ExpenseConceptsListModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  concept: IConcept;
  title: string = 'Concepto de Pago';
  directions: { id: string; description: string }[] = [
    { id: 'M', description: 'MUEBLES' },
    { id: 'I', description: 'INMUEBLES' },
    { id: 'C', description: 'GENERAL' },
    { id: 'V', description: 'VIGILANCIA' },
    { id: 'S', description: 'SEGUROS' },
    { id: 'J', description: 'JURÍDICO' },
    { id: 'A', description: 'ADMINISTRACIÓN' },
  ];
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private conceptsService: ConceptsService,
    private expenseConceptsService: ExpenseConceptsService
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit() {
    if (this.concept) {
      console.log(this.concept);
      this.form.setValue(this.concept);
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [null, [Validators.required]],
      address: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      routineCalculation: [null],
      automatic: [null],
      numerary: [null],
    });
  }

  confirm() {
    console.log(this.form.value);
    this.loader.load = true;
    if (this.concept) {
      this.onEditConfirm(this.form.value);
    } else {
      this.onAddConfirm(this.form.value);
    }
  }

  private getAddressCode(address: string) {
    return this.expenseConceptsService.getAddressCode(address);
  }

  private onEditConfirm(body: any) {
    console.log(body);
    // return;
    if (body) {
      this.conceptsService
        .edit({
          ...body,
          address: body.address,
          automatic: body.automatic ? 'S' : 'N',
          numerary: body.numerary ? 'S' : 'N',
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.loader.load = false;
            this.alert(
              'success',
              'El concepto de pago ' + body.id + ' ha sido actualizado',
              ''
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          },
          error: err => {
            this.loader.load = false;
            this.alert(
              'error',
              'ERROR',
              'No se pudo actualizar el concepto de pago ' + body.id
            );
          },
        });
    } else {
      this.loader.load = false;
    }
  }

  private onAddConfirm(body: any) {
    console.log(body);
    if (body) {
      this.conceptsService
        .create({
          ...body,
          address: body.address,
          automatic: body.automatic ? 'S' : 'N',
          numerary: body.numerary ? 'S' : 'N',
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.loader.load = false;
            this.alert('success', 'El concepto de pago ha sido creado', '');
            this.modalRef.content.callback(true);
            this.modalRef.hide();
            // this.getData();
          },
          error: err => {
            this.loader.load = false;
            this.alert(
              'error',
              'No se pudo crear el concepto de pago',
              'Favor de verificar'
            );
          },
        });
    } else {
      this.loader.load = false;
    }
  }

  close() {
    this.modalRef.hide();
  }
}
