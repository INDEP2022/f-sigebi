import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { InconsistenciesComponent } from '../inconsistencies/inconsistencies.component';
import { RateChangeComponent } from '../rate-change/rate-change.component';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ExpenseParametercomerService } from '../../expense-capture/services/expense-parametercomer.service';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-tax-validation-calculation',
  templateUrl: './tax-validation-calculation.component.html',
  styles: [],
})
export class TaxValidationCalculationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  DIRECCION: 'I';

  TIPO_PROCESO: any;
  V_WHERE_IDAVALUO: any;

  V_IVA: any;
  V_NO_COLUM: any;

  V_TMPBIENES_ERROR: any;
  V_TMPAVALUO_ERROR: any;

  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private expenseParametercomerService: ExpenseParametercomerService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
    this.getValueIva();
    //let token = this.authService.decodeToken();
    let token = 'JBUSTOS';
    if (token == 'JBUSTOS') {
      //Activar botón Confirmar
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      range: [20, [Validators.required]],
      eventId: [null, [Validators.required]],
      processKey: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      eventDate: [null, [Validators.required]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      requestDate: [null, [Validators.required]],
      requestType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      reference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  openModalRateChange(context?: Partial<RateChangeComponent>): void {
    const modalRef = this.modalService.show(RateChangeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      //if (data)
    });
  }

  openModalInconsistencies(context?: Partial<InconsistenciesComponent>): void {
    const modalRef = this.modalService.show(InconsistenciesComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.selected.subscribe((data: any) => {
      //console.log(data)
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  getValueIva() {
    this.expenseParametercomerService.getParameterMod().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp getValueIva-> ', resp);
          this.V_IVA = '0.' + resp.data[0].value;
          console.log('this.V_IVA-> ', this.V_IVA);
        }
      },
      error => {
        console.log('Error al obtener el valor del IVA. ');
      }
    );
  }

  consult() {
    const { eventId } = this.form.value;

    if (eventId == null) {
      this.alert('warning', '', 'Debe ingresar el No. Evento');
    } else if (eventId != null) {
    }
  }
}
