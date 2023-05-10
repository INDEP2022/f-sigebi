/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import compareDesc from 'date-fns/compareDesc';
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsDepositaryService } from './services/goods-depositary.service';
import {
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_REPORT,
  ERROR_SUBTYPE_DELEGATIONS,
  ERROR_SUBTYPE_GOOD,
} from './utils/goods-depositary.message';

@Component({
  selector: 'app-goods-depositary',
  templateUrl: './goods-depositary.component.html',
  styleUrls: ['./goods-depositary.component.scss'],
})
export class GoodsDepositaryComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  delegationData = new DefaultSelect();
  subDelegationData = new DefaultSelect();
  depositaryData = new DefaultSelect();
  federativeEntityData = new DefaultSelect();
  goodTypeData = new DefaultSelect();
  goodSubTypeData = new DefaultSelect();

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exampleService: ExampleService,
    private svGoodsDepositaryService: GoodsDepositaryService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegacion: [null, [Validators.required]], //* Delegación Detalle
      subdelegacion: [null, [Validators.required]], //* Subdelegación Detalle
      depositaria: [null, [Validators.required]], //*  Depositaria Detalle
      entidadFederativa: [null, [Validators.required]], //* Entidad Federativa Detalle
      tipoBien: [null, [Validators.required]], //* Tipo Bien Detalle
      subTipoBien: [null, [Validators.required]], //* Subtipo Bien Detalle
      tipo: ['', [Validators.required]], //* "Administrador, Depositaría, Interventor, Todos"
      fechaRadio: ['P', [Validators.required]],
      from: [{ value: '', disabled: false }, [Validators.required]], //*
      to: [{ value: '', disabled: false }, [Validators.required]], //*
    });
  }

  btnImprimir(): any {
    if (this.form.valid) {
      let validDate = null;
      if (!this.form.get('from').value && !this.form.get('to').value) {
        validDate = 0;
      } else {
        validDate = compareDesc(
          this.form.get('from').value,
          this.form.get('to').value
        );
      }
      if (this.form.get('from').value && !this.form.get('to').value) {
        validDate = 0;
      }
      if (validDate >= 0) {
        console.log(this.form.value);
        let params = {
          PARAMFORM: 'NO',
          PC_ADMIN: this.form.get('tipo').value,
          PC_DEPOSITARIO: this.form.get('depositaria').value,
          PC_ENTFED: this.form.get('entidadFederativa').value,
          PN_DELEGACION: this.form.get('delegacion').value,
          PN_SUBDELEGACION: this.form.get('subdelegacion').value,
          PC_TIPO: this.form.get('tipoBien').value,
          PC_STIPO: this.form.get('subTipoBien').value,
          PF_FECINI: this.datePipe.transform(
            this.form.get('from').value,
            'dd-MM-yyyy'
          ),
          PF_FECFIN: this.datePipe.transform(
            this.form.get('to').value,
            'dd-MM-yyyy'
          ),
        };

        this.siabService
          .fetchReport(
            this.getReportName(this.form.get('fechaRadio').value),
            params
          )
          .subscribe(response => {
            if (response !== null) {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                }, //pasar datos por aca
                class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
                ignoreBackdropClick: true, //ignora el click fuera del modal
              };
              this.modalService.show(PreviewDocumentsComponent, config);
            } else {
              this.alert('warning', ERROR_REPORT, '');
            }
          });
      } else {
        this.onLoadToast('warning', 'Fechas incorrectas', ERROR_FORM_FECHA);
      }
    } else {
      this.form.markAllAsTouched();
      this.alert('warning', ERROR_FORM, '');
    }
  }

  getReportName(optionSelected: string) {
    switch (optionSelected) {
      case 'P':
        return 'RGENADBBIENESXDEP';
      case 'D':
        return 'RGENADBBIENESXDED';
      case 'R':
        return 'RGENADBBIENESXDER';
      default:
        return 'RGENADBBIENESXDET';
    }
  }

  async getDelegations(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'description:ASC';
    let subscription = this.svGoodsDepositaryService
      .getDelegations(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.delegationData = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.delegationData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  async getSubDelegations(paramsData: ListParams) {
    if (this.form.get('delegacion').invalid) {
      this.subDelegationData = new DefaultSelect();
      this.alert('info', ERROR_SUBTYPE_DELEGATIONS, '');
      return;
    }
    paramsData['filter.delegationNumber'] =
      '$eq:' + this.form.get('delegacion').value;
    paramsData['filter.description'] = '$ilike:' + paramsData['search'];
    paramsData['sortBy'] = 'description:ASC';
    delete paramsData['text'];
    let subscription = this.svGoodsDepositaryService
      .getSubDelegations(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.subDelegationData = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.subDelegationData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  async getDepositary(paramsData: ListParams) {
    paramsData['filter.name'] = '$ilike:' + paramsData['search'];
    paramsData['sortBy'] = 'name:DESC';
    delete paramsData['text'];
    let subscription = this.svGoodsDepositaryService
      .getDepositary(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.depositaryData = new DefaultSelect(
            data.data.map(i => {
              i.name = '#' + i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.depositaryData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  async getFederativeEntity(paramsData: ListParams) {
    paramsData['filter.descCondition'] = '$ilike:' + paramsData['search'];
    paramsData['sortBy'] = 'descCondition:DESC';
    delete paramsData['text'];
    let subscription = this.svGoodsDepositaryService
      .getFederativeEntity(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.federativeEntityData = new DefaultSelect(
            data.data.map(i => {
              i.descCondition = '#' + i.id + ' -- ' + i.descCondition;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.federativeEntityData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  async getGoodType(paramsData: ListParams) {
    paramsData['filter.nameGoodType'] = '$ilike:' + paramsData['search'];
    paramsData['sortBy'] = 'nameGoodType:ASC';
    delete paramsData['text'];
    let subscription = this.svGoodsDepositaryService
      .getGoodType(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.goodTypeData = new DefaultSelect(
            data.data.map(i => {
              i.nameGoodType = '#' + i.id + ' -- ' + i.nameGoodType;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.goodTypeData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  async getSubTypeGood(paramsData: ListParams) {
    if (this.form.get('tipoBien').invalid) {
      this.goodSubTypeData = new DefaultSelect();
      this.alert('info', ERROR_SUBTYPE_GOOD, '');
      return;
    }
    paramsData['filter.idGoodType'] = '$eq:' + this.form.get('tipoBien').value;
    paramsData['filter.nameGoodType'] = '$ilike:' + paramsData['search'];
    paramsData['sortBy'] = 'nameGoodType:ASC';
    delete paramsData['text'];
    let subscription = this.svGoodsDepositaryService
      .getSubTypeGood(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.goodSubTypeData = new DefaultSelect(
            data.data.map((i: any) => {
              i.nameGoodSubtype = '#' + i.id + ' -- ' + i.nameGoodSubtype;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.goodSubTypeData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  onChangeRadioDates(event: any) {
    // if (event.target.value == 'T') {
    //   this.form.get('from').enable();
    //   this.form.get('to').enable();
    //   this.form.get('from').addValidators([Validators.required]);
    //   this.form.get('to').addValidators([Validators.required]);
    //   this.form.get('from').updateValueAndValidity();
    //   this.form.get('to').updateValueAndValidity();
    // } else {
    //   this.form.get('from').disable();
    //   this.form.get('to').disable();
    //   this.form.get('from').clearValidators();
    //   this.form.get('to').clearValidators();
    // }
  }
}
