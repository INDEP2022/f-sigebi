import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-layout-maintenance-structure-modal',
  templateUrl: './layout-maintenance-structure-modal.component.html',
  styles: [],
})
export class LayoutMaintenanceStructureModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Columna de Layout';
  structure: any;
  positions: number[] = [];
  edit: boolean = false;
  structureForm: FormGroup = new FormGroup({});
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.structureForm = this.fb.group({
      position: [null, [Validators.required]],
      column: [null, Validators.pattern(STRING_PATTERN)],
      type: [null],
      length: [null, [Validators.required, Validators.maxLength(1)]],
      constant: [null, Validators.pattern(STRING_PATTERN)],
      fillCharacter: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fillPosition: [null, [Validators.required]],
      decimals: [null],
      dateFormat: [null, Validators.pattern(STRING_PATTERN)],
    });
    if (this.structure !== undefined) {
      this.edit = true;
      this.structureForm.patchValue(this.structure);
    } else {
      this.structureForm.controls['decimals'].disable();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    if (
      this.positions.indexOf(this.structureForm.controls['position'].value) !=
      -1
    ) {
      this.onLoadToast(
        'error',
        'Valor no permitido',
        'El valor de posición introducido ya está siendo utilizado'
      );
      return;
    }
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.edit
      ? this.onEdit.emit(this.structureForm.value)
      : this.onAdd.emit(this.structureForm.value);
    this.modalRef.hide();
  }

  enableDecimals(type: string) {
    if (type == 'NUMBER') {
      this.structureForm.controls['decimals'].enable();
    } else {
      this.structureForm.controls['decimals'].setValue('');
      this.structureForm.controls['decimals'].disable();
    }
  }
}
