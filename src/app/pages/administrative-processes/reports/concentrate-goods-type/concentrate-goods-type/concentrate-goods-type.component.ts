import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-concentrate-goods-type',
  templateUrl: './concentrate-goods-type.component.html',
  styles: [],
})
export class ConcentrateGoodsTypeComponent implements OnInit {
  concentrateGoodsTypeForm: ModelForm<any>;
  minDate: Date;
  maxDate: Date = new Date();
  endDate: Date;
  result: any;
  result1: any;
  noDel: number;
  noSubDel: number;
  numberType: number;
  numberSubType: number;
  fileNumberExp: number;
  delegations: DefaultSelect = new DefaultSelect([], 0);
  subDelegations: DefaultSelect = new DefaultSelect([], 0);
  goodType: DefaultSelect = new DefaultSelect([], 0);
  goodSubType: DefaultSelect = new DefaultSelect([], 0);
  numberExp: DefaultSelect = new DefaultSelect([], 0);
  numberEndExp: DefaultSelect = new DefaultSelect([], 0);
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private usersService: UsersService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private parametersService: ParametersService,
    private subDelegationService: SubDelegationService,
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private fIndicaService: FIndicaService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.concentrateGoodsTypeForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      initialFile: [null, Validators.required],
      finalFile: [null, Validators.required],
      ReceptionDateOf: [null, Validators.required],
      ReceptionDateTo: [null, Validators.required],
    });
    this.concentrateGoodsTypeForm.get('ReceptionDateTo').disable();
    this.concentrateGoodsTypeForm.get('subDelegation').disable();
    this.concentrateGoodsTypeForm.get('type').disable();
    this.concentrateGoodsTypeForm.get('initialFile').disable();
    this.concentrateGoodsTypeForm.get('finalFile').disable();
  }
  /*onSubmit() {
    // Log y url con parámetros quemados
    console.log(this.concentrateGoodsTypeForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERADBDEVDECBIEN.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.concentrateGoodsTypeForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }

    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERADBDEVDECBIEN, params)
        .subscribe({
          next: response => {
            console.log(response);
            window.open(pdfurl, 'DOCUMENT');
          },
          error: () => {
            window.open(pdfurl, 'DOCUMENT');
          },
        });
    }, 1000);
  }*/

  validateDate(event: Date) {
    //console.log(event);
    if (event) {
      this.minDate = event;
      this.concentrateGoodsTypeForm.get('ReceptionDateTo').enable();
    }
  }

  report() {
    //FESTCOTPRE_0001
    let params = {
      //PN_DEVOLUCION: this.data,
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
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
      }
    });
  }

  async getCatalogDelegation(params: ListParams) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}/${month}/${day}`;
    const etapa = await this.getFaStageCreda(SYSDATE);
    params['filter.etapaEdo'] = `$eq:${etapa}`;
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['noDelDesc'] = item.id + ' - ' + item.description;
        });
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  async getFaStageCreda(data: any) {
    return firstValueFrom(
      this.parametersService.getFaStageCreda(data).pipe(
        catchError(error => {
          return of(null);
        }),
        map(resp => resp.stagecreated)
      )
    );
  }

  async changeDelegation(event: any) {
    if (event) {
      if (this.noDel) {
        this.concentrateGoodsTypeForm.get('subDelegation').reset();
      }
      this.noDel = event.id;
      this.getSubDelegation(new ListParams());
    }
  }

  async getSubDelegation(params: ListParams) {
    if (this.noDel) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}/${month}/${day}`;
      const etapa = await this.getFaStageCreda(SYSDATE);
      params['filter.phaseEdo'] = `$eq:${etapa}`;
      params['filter.delegationNumber'] = `$eq:${this.noDel}`;
      if (params.text) {
        if (!isNaN(parseInt(params.text))) {
          params['filter.id'] = `$eq:${params.text}`;
          params['search'] = '';
        } else if (typeof params.text === 'string') {
          params['filter.description'] = `$ilike:${params.text}`;
        }
      }
      this.subDelegationService.getAll2(params).subscribe({
        next: resp => {
          console.log(resp.data);
          this.result1 = resp.data.map(async (item: any) => {
            item['noSubDelDesc'] = item.id + ' - ' + item.description;
          });
          this.subDelegations = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.subDelegations = new DefaultSelect();
        },
      });
      this.concentrateGoodsTypeForm.get('subDelegation').enable();
    }
  }

  changeSubDelegation(event: any) {
    if (event) {
      this.noSubDel = event.id;
    }
  }

  getGoodType(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['idName'] = item.id + ' - ' + item.nameGoodType;
        });
        this.goodType = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.goodType = new DefaultSelect();
      },
    });
  }

  async changeGoodType(event: any) {
    //let valAux = 0;
    if (event) {
      if (this.numberType) {
        //this.goodSubType = new DefaultSelect();
        this.concentrateGoodsTypeForm.get('type').reset();
      }
      this.numberType = event.id;
      this.getGoodSubTypes(new ListParams());
    }
  }

  async getGoodSubTypes(params: ListParams) {
    if (this.numberType) {
      if (params.text) {
        if (!isNaN(parseInt(params.text))) {
          params['filter.id'] = `$eq:${params.text}`;
          params['search'] = '';
        } else if (typeof params.text === 'string') {
          params['filter.nameSubtypeGood'] = `$ilike:${params.text}`;
        }
      }
      params['filter.idTypeGood'] = `$eq:${this.numberType}`;
      this.goodSubTypesService.getAllDetails(params).subscribe({
        next: resp => {
          console.log(resp.data);
          this.result = resp.data.map(async (item: any) => {
            item['idNameSub'] = item.id + ' - ' + item.nameSubtypeGood;
          });
          this.goodSubType = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.goodSubType = new DefaultSelect();
        },
      });
      this.concentrateGoodsTypeForm.get('type').enable();
    }
  }

  changeGoodSubType(event: any) {
    if (event) {
      this.numberSubType = event.id;
      this.getNumberExp(new ListParams());
    }
  }

  getNumberExp(params: ListParams) {
    if (this.noDel && this.noSubDel && this.numberType && this.numberSubType) {
      let body = {
        delegationNumber: this.noDel,
        subdelegationNumber: this.noSubDel,
        diParam5: this.numberType,
        tiParam4: this.numberSubType,
      };
      if (params.text) {
        params['filter.fileNumber'] = `$eq:${params.text}`;
      }
      this.fIndicaService.getRegFile(body, params).subscribe({
        next: resp => {
          /*console.log(resp.data);
          this.result = resp.data.map(async (item: any) => {
            item['idNameSub'] = item.id + ' - ' + item.nameSubtypeGood;
          });*/
          this.numberExp = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.numberExp = new DefaultSelect();
        },
      });
      this.concentrateGoodsTypeForm.get('initialFile').enable();
    }
  }

  changeNumberExp(event: any) {
    if (event) {
      this.fileNumberExp = event.fileNumber;
      this.getNumberEndExp(new ListParams());
    }
  }

  getNumberEndExp(params: ListParams) {
    if (
      this.noDel &&
      this.noSubDel &&
      this.numberType &&
      this.numberSubType &&
      this.fileNumberExp
    ) {
      let body = {
        delegationNumber: this.noDel,
        subdelegationNumber: this.noSubDel,
        diParam5: this.numberType,
        tiParam4: this.numberSubType,
        tiParam3: this.fileNumberExp,
      };
      if (params.text) {
        params['filter.fileNumber'] = `$eq:${params.text}`;
      }
      this.fIndicaService.getRegFinalFile(body, params).subscribe({
        next: resp => {
          /*console.log(resp.data);
          this.result = resp.data.map(async (item: any) => {
            item['idNameSub'] = item.id + ' - ' + item.nameSubtypeGood;
          });*/
          this.numberEndExp = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.numberEndExp = new DefaultSelect();
        },
      });
      this.concentrateGoodsTypeForm.get('finalFile').enable();
    }
  }

  changeNumberEndExp(event: any) {}
}
