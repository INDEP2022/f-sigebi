import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-catalog-of-inventory-types',
  templateUrl: './catalog-of-inventory-types.component.html',
  styles: [],
})
export class CatalogOfInventoryTypesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
  title: string = 'Tipo de Inventario';
  allotment: any;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private inventoryServ: InventoryTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      cveTypeInventory: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.minLength(1),
          Validators.maxLength(10),
          Validators.required,
        ],
      ],
      description: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      noRegister: [null],
    });
    if (this.allotment != null) {
      console.log(this.allotment);
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  confirm() {
    if (this.form.valid) {
      const { cveTypeInventory } = this.form.value;
      if (this.edit) {
        this.insert();
        return;
      }
      this.inventoryServ.getInventotyById(cveTypeInventory).subscribe({
        next: () => {
          this.alert(
            'error',
            `El Tipo de Inventario: ${cveTypeInventory}, ya fue registrado.`,
            ''
          );
        },
        error: err => {
          if (err.status === 400) {
            this.insert();
          }
        },
      });
    }
  }

  insert() {
    if (this.edit) {
      const { cveTypeInventory } = this.form.getRawValue();
      this.inventoryServ
        .updateInventory(cveTypeInventory, this.form.getRawValue())
        .subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: err => {
            this.alert('warning', err.error.message, '');
          },
        });
    } else {
      if (
        this.form.controls['description'].value.trim() === '' ||
        this.form.controls['cveTypeInventory'].value.trim() === ''
      ) {
        this.alert('warning', 'No se puede guardar campos vacíos', '');
        return;
      }
      this.loading = true;
      this.inventoryServ.createInventory(this.form.getRawValue()).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: err => {
          this.alert('warning', err.error.message, '');
        },
      });
    }
  }
  deleteDetail(event: string | number) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.inventoryServ.remove(event).subscribe({
          next: () => {
            this.alert(
              'success',
              'Tipo de Inventario',
              'Eliminado correctamente'
            );
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
  handleSuccess() {
    this.loading = false;
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
