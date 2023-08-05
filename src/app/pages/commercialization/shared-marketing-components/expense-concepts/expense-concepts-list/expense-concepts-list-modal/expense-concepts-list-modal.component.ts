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
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      address: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      routineCalculation: [null, [Validators.pattern(STRING_PATTERN)]],
      automatic: [null],
      numerary: [null],
    });
  }

  confirm() {
    console.log(this.form.value);
    if (this.concept) {
      this.onEditConfirm(this.form.value);
    } else {
      this.onAddConfirm(this.form.value);
    }
  }

  private getAddressCode(address: string) {
    return this.expenseConceptsService.getAddressCode(address);
  }

  onEditConfirm(body: any) {
    console.log(event);
    if (body) {
      this.conceptsService
        .edit({
          ...body,
          address: this.getAddressCode(body.address),
          automatic: body.automatic ? 'S' : 'N',
          numerary: body.numerary ? 'S' : 'N',
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Edición de Concepto de Pago ' + body.id,
              'Actualizado Correctamente'
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          },
          error: err => {
            this.alert(
              'error',
              'ERROR',
              'No se pudo actualizar el concepto de pago ' + body.id
            );
          },
        });
    }
  }

  private onAddConfirm(body: any) {
    console.log(body);
    if (body) {
      this.conceptsService
        .create({
          ...body,
          address: this.getAddressCode(body.address),
          automatic: body.automatic ? 'S' : 'N',
          numerary: body.numerary ? 'S' : 'N',
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.alert('success', 'Concepto de Pago', 'Creado correctamente');
            this.modalRef.content.callback(true);
            this.modalRef.hide();
            // this.getData();
          },
          error: err => {
            this.alert(
              'error',
              'ERROR',
              'No se pudo crear el concepto de pago'
            );
          },
        });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
