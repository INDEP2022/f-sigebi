import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IInventoryQuery,
  TypesInventory,
} from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListTypeOfInventoryComponent } from '../list-type-of-inventory/list-type-of-inventory.component';
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
  edit: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  public dataDetail: IListResponse<IInventoryQuery> =
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
    this.dataDetail.count = 0;
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
  }

  openForm(allotment?: any) {
    let config: ModalOptions = {
      initialState: {
        data: this.form.value,
        allotment,
        callback: (next: boolean, idCv: string) => {
          if (next) this.getDetailInventory(idCv);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCatalogOfInventoryTypesComponent, config);
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
          this.onLoadToast(
            'error',
            `La clave ${cveTypeInventory} ya existe, favor de verificar.`,
            ''
          );
        },
        error: err => {
          if (err.status === 400) {
            this.onLoadToast(
              'info',
              `La clave ${cveTypeInventory} es valida`,
              ''
            );
            this.insert();
          }
        },
      });
    }
  }

  insert() {
    if (this.edit) {
      const { cveTypeInventory } = this.form.value;
      this.inventoryServ
        .updateInventory(cveTypeInventory, this.form.value)
        .subscribe({
          next: () => {
            this.edit = true;
            this.onLoadToast(
              'success',
              'Inventario actualizado correctamente',
              ''
            );
          },
          error: err => {
            this.onLoadToast('warning', err.error.message, '');
          },
        });
    } else {
      this.inventoryServ.createInventory(this.form.value).subscribe({
        next: () => {
          this.edit = true;
          this.onLoadToast('success', 'Inventario creado correctamente', '');
        },
        error: err => {
          this.onLoadToast('warning', err.error.message, '');
        },
      });
    }
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: TypesInventory) => {
          if (next) {
            this.edit = next;
            this.form.patchValue(data);
            this.getDetailInventory(data.cveTypeInventory);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListTypeOfInventoryComponent, config);
  }

  getDetailInventory(cv: string) {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      const filters = this.params.getValue();
      filters.removeAllFilters();
      filters.addFilter('cveTypeInventory', cv, SearchFilter.EQ);
      this.inventoryServ
        .getAllWithFiltersDetails(filters.getParams())
        .subscribe({
          next: resp => {
            this.dataDetail = resp;
          },
          error: err => {
            this.dataDetail.data = [];
            this.dataDetail.count = 0;
            this.onLoadToast('error', err.error.message, '');
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
        this.inventoryServ.remove(event).subscribe({
          next: () => {
            this.onLoadToast('success', 'Eliminado correctamente', '');
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }

  clean() {
    this.form.reset();
    this.edit = false;
  }
}
