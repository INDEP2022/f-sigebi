import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { InventoryService } from 'src/app/core/services/ms-inventory-type/inventory.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from './../../../../core/interfaces/model-form';

@Component({
  selector: 'app-inventory-data',
  templateUrl: './inventory-data.component.html',
  styles: [],
})
export class InventoryDataComponent extends BasePage implements OnInit {
  inventoryDataForm: ModelForm<any>;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
  @Input() goodId: number;

  constructor(
    private fb: FormBuilder,
    private readonly inventoryService: InventoryService,
    private readonly router: Router
  ) {
    super();
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      no_inventario: {
        title: 'No. Inventario',
        type: 'number',
        sort: false,
      },
      fec_inventario: {
        title: 'Fecha Inventario',
        type: 'string',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return this.formatearFecha(new Date(value));
        },
      },
      responsable: {
        title: 'Responsable',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.inventoryForGood(this.goodId));
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

  inventoryForGood(idGood: number) {
    this.loading = true;
    this.inventoryService
      .getInventoryByGood(38485, this.params.getValue())
      .subscribe({
        next: response => {
          this.data = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }

  getAtribute() {}

  inventoryAutorization() {
    /// Aca va la ruta donde se redireccionara
    /* const strategyRoute =
      'pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event/generate-estrategy';
    this.router.navigate([strategyRoute], {
      queryParams: {  },
    }); */
  }
}
