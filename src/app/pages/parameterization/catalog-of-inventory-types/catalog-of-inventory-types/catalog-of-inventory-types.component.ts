import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IInventoryQuery,
  TypesInventory,
} from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalCatalogOfInventoryTypesComponent } from '../modal-catalog-of-inventory-types/modal-catalog-of-inventory-types.component';

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
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  @ViewChild('inv', { static: true }) inventory: ElementRef<HTMLInputElement>;
  isPresent: string = '';

  public dataInventory: IListResponse<IInventoryQuery> =
    {} as IListResponse<IInventoryQuery>;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private inventoryServ: InventoryTypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: {
        noTypeInventory: {
          title: 'Número',
          sort: false,
        },
        attributeInventory: {
          title: 'Atributo Inventario',
          sort: false,
        },
        typeData: {
          title: 'Tipo de Dato',
          sort: false,
        },
      },
    };
    this.dataInventory.count = 0;
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
        ],
      ],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      noRegister: [null],
    });

    this.searchInventory();
  }

  searchInventory() {
    let timeout: any;
    this.inventory.nativeElement.addEventListener('keyup', (ev: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        if (ev.target.value != '') {
          this.inventoryServ.getInventotyById(ev.target.value).subscribe({
            next: (next: any) => {
              const data = next as TypesInventory;
              this.form.patchValue(data);
              this.isPresent = 'NID';
              this.getPagination();
            },
            error: err => {
              this.onLoadToast('warning', err.error.message, '');
              this.reset();
            },
          });
        } else {
          this.reset();
          this.isPresent = '';
        }
      }, 1000);
    });
  }

  reset() {
    this.form.get('noRegister').patchValue(null);
    this.form.get('description').patchValue(null);
    this.isPresent = 'N';
    this.dataInventory = {} as IListResponse<IInventoryQuery>;
    this.dataInventory.count = 0;
  }

  openForm(allotment?: any) {
    let config: ModalOptions = {
      initialState: {
        data: this.form.value,
        allotment,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCatalogOfInventoryTypesComponent, config);
  }

  getPagination() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      const filter = this.form.get('cveTypeInventory').value;
      this.inventoryServ.getAll(this.params.getValue(), filter).subscribe({
        next: resp => {
          this.dataInventory = resp;
        },
        error: err => {
          this.onLoadToast('warning', err.error.message, '');
          this.dataInventory = {} as IListResponse<IInventoryQuery>;
          this.dataInventory.count = 0;
        },
      });
    });
  }

  deleteDetail(event: string | number) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.inventoryServ.delete(event).subscribe({
          next: () => {
            this.onLoadToast('success', 'Eliminado correctamente', '');
            this.getPagination();
          },
          error: err => this.onLoadToast('warning', err.error.message, ''),
        });
      }
    });
  }

  nuevoInventory() {
    this.alertQuestion(
      'question',
      'Creación',
      `Estas seguro de crear este inventario ${
        this.form.get('cveTypeInventory').value
      }`
    ).then(question => {
      if (question.isConfirmed) {
        this.inventoryServ.createInventory(this.form.value).subscribe({
          next: () => {
            this.isPresent = 'NID';
            this.onLoadToast('success', 'Inventario creado correctamente', '');
            this.getPagination();
          },
          error: err => this.onLoadToast('warning', err.error.message, ''),
        });
      }
    });
  }
}
