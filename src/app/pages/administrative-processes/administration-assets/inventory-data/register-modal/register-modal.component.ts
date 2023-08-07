import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInventoryGood } from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryService } from 'src/app/core/services/ms-inventory-type/inventory.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styles: [],
})
export class RegisterModalComponent extends BasePage implements OnInit {
  inventoryDataForm: ModelForm<any>;
  goodId: number;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private readonly inventoryService: InventoryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.inventoryDataForm = this.fb.group({
      noInventario: [null, [Validators.required]],
      fechaInventario: [new Date(), [Validators.required]],
      responsable: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    const model: IInventoryGood = {
      inventoryNumber: this.inventoryDataForm.get('noInventario').value,
      goodNumber: this.goodId,
      dateInventory: this.inventoryDataForm.get('fechaInventario').value,
      responsible: this.inventoryDataForm.get('responsable').value,
    };
    this.inventoryService.create(model).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: err => {
        console.log(err);
        this.alert(
          'error',
          'Registro de Inventario',
          'No se Pudo Guardar el Inventario'
        );
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro de Inventario', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
