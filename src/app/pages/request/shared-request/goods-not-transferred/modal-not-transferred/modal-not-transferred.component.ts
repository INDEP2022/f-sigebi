import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { INoTransfer } from 'src/app/core/models/no-transfer/no-transfer';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { NoTransferService } from 'src/app/core/services/no-transfer/no-transfer.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-modal-not-transferred',
  templateUrl: './modal-not-transferred.component.html',
  styles: [],
})
export class ModalNotTransferredComponent extends BasePage implements OnInit {
  title: string = 'Bien no transferido';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  @Input() requestId: number;

  typeGoods = new DefaultSelect<IWarehouse>();
  dataUnit = new DefaultSelect();

  private tranferService = inject(NoTransferService);

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private typeRelevantService: TypeRelevantService,
    private unitMessureService: StrategyServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTypeRelevant(new ListParams());
    this.getCatalogUnit(new ListParams());

    this.prepareForm();
  }

  getTypeRelevant(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeGoods = new DefaultSelect(data.data, data.count);
      },
    });
  }

  // Añade una variable de instancia para rastrear la página actual
  currentPage = 1;

  getCatalogUnit(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('idWarehouse', e.text);
        }
      }
    }
    // Usa la variable de instancia para rastrear la página actual
    paramsF.page = this.currentPage++;

    this.unitMessureService.getMedUnits(paramsF.getParams()).subscribe(
      res => {
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.idWarehouse} - ${e.description}`,
          };
        });
        // Añade los nuevos resultados a this.dataUnit en lugar de reemplazarlos
        this.dataUnit = new DefaultSelect(
          [...this.dataUnit.data, ...newData],
          res.count
        );
      },
      err => {
        this.dataUnit = new DefaultSelect();
      }
    );
  }

  createTransfer(obj: Object) {
    return new Promise((resolve, reject) => {
      this.tranferService.createNoTransfer(obj).subscribe({
        next: resp => {
          this.onLoadToast('success', 'Bien no transferido creado con éxito');
          resolve(resp);
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo crear el Bien no transferido');
          reject(error);
        },
      });
    });
  }

  updateTransfer(obj: INoTransfer) {
    return new Promise((resolve, reject) => {
      this.tranferService.updateNoTransfer(obj).subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Bien no transferido actualizado con éxito'
          );
          resolve(resp);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'No se pudo actualizar el Bien no transferido'
          );
          reject(error);
        },
      });
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      relevantType: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unitExtent: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  async save() {
    let object = this.form.getRawValue();
    if (this.allotment != null) {
      object['goodNumbertransferredId'] =
        this.allotment.goodNumbertransferredId;
    }

    let fechaActual = new Date();
    let fechaEntero = fechaActual.getTime();
    let fechaCadena = fechaEntero.toString();
    let fechaCortada = fechaCadena.substring(3);
    let fechaFinal = parseInt(fechaCortada);

    if (isNullOrEmpty(this.allotment)) {
      object['applicationId'] = this.requestId;
      object['goodNumbertransferredId'] = fechaFinal;

      await this.createTransfer(object);
    } else {
      await this.updateTransfer(object);
    }

    this.refresh.emit(true);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
