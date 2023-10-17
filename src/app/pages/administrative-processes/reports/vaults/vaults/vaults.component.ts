import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styles: [],
})
export class VaultsComponent extends BasePage implements OnInit {
  //vaultsForm: ModelForm<any>;
  vaultsForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  diPass: string;
  minDate: Date;
  minDate1: Date;
  maxDate: Date = new Date();
  endDate: Date;
  noDeleg: number;
  noSubDeleg: number;
  result: any;
  delegation = new DefaultSelect();
  vault = new DefaultSelect();
  status = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private parametersService: ParametersService,
    private usersService: UsersService,
    private goodService: GoodService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.initializeShape();
  }
  private prepareForm() {
    this.vaultsForm = this.fb.group({
      regional: [null, [Validators.required]],
      vaults: [null, [Validators.required]],
      statusGoods: [null, [Validators.required]],
      entryDateFrom: [null, [Validators.required]],
      until: [null, [Validators.required]],
      departureDateOf: [null, [Validators.required]],
      until1: [null, [Validators.required]],
    });
    this.vaultsForm.get('until').disable();
    this.vaultsForm.get('until1').disable();
    this.vaultsForm.get('vaults').disable();
  }
  /*onSubmit() {
    // Log y url con parámetros quemados
    console.log(this.vaultsForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERADBBOVEDAS.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.vaultsForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERADBBOVEDAS, params)
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

  async initializeShape() {
    let pass = await this.initialValue();
    let passData: any = pass;
    console.log(passData.data[0].initialValue, passData.count);
    if (passData.count > 0) {
      let vcPass = passData.data[0].initialValue;
      this.diPass = this.processPasswordString(vcPass);
      console.log(this.diPass);
    }
  }

  processPasswordString(password: string): string {
    let processedPassword = '';
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      const modifiedCharCode = charCode - 1;
      const modifiedChar = String.fromCharCode(modifiedCharCode);
      processedPassword += modifiedChar;
    }
    return processedPassword;
  }

  async initialValue() {
    return new Promise((resolve, reject) => {
      this.params.getValue()['filter.id'] = 'PASSW';
      let params = {
        ...this.params.getValue(),
        //...this.columnFilters,
      };
      this.parametersService.getAll(params).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  validateDate(event: Date) {
    //console.log(event);
    if (event) {
      this.minDate = event;
      this.vaultsForm.get('until').enable();
    }
  }

  validateDate1(event: Date) {
    if (event) {
      this.minDate1 = event;
      this.vaultsForm.get('until1').enable();
    }
  }

  getRegional(params: ListParams) {
    console.log(params.text);
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.no_delegacion'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.descripcion'] = `$ilike:${params.text}`;
      }
    }
    let body = {};
    this.usersService.getGetRecDeleg(body, params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['noDelDesc'] = item.no_delegacion + ' - ' + item.descripcion;
        });
        this.delegation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.delegation = new DefaultSelect();
      },
    });
  }

  async changeDelegation(event: any) {
    //console.log(event.no_delegacion);
    if (event) {
      if (this.noDeleg) {
        this.vaultsForm.get('vaults').reset();
      }
      this.noDeleg = event.no_delegacion;
      let recSubDel = await this.getRecSubDel(this.noDeleg, new ListParams());
      let dataRecSubDel: any = recSubDel;
      this.noSubDeleg = dataRecSubDel.data[0].no_subdelegacion;
      console.log(dataRecSubDel.data[0].no_subdelegacion);
      setTimeout(() => {
        this.getVault(new ListParams());
      }, 1000);
      this.vaultsForm.get('vaults').enable();
    }
  }

  async getRecSubDel(numberDel: number, params: ListParams) {
    return new Promise((resolve, reject) => {
      this.usersService.getGetRecSubDel(numberDel, params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  getVault(params: ListParams) {
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.no_boveda'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.descripcion'] = `$ilike:${params.text}`;
      }
    }
    let body = {
      tiParam4: this.noSubDeleg,
      tiParam3: this.noDeleg,
    };
    this.usersService.getRecVault(body, params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['noBoDesc'] = item.no_boveda + ' - ' + item.descripcion;
        });
        this.vault = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.vault = new DefaultSelect();
      },
    });
  }

  changeVault(event: any) {}

  getStatusGood(params: ListParams) {
    console.log(params.text);
    if (params.text) {
      params['search'] = params.text;
      /*if (!isNaN(parseInt(params.text))) {
        params['filter.status'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.descripcion'] = `$ilike:${params.text}`;
      }*/
    }
    this.goodService.getStatusAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['statusDesc'] = item.status + ' - ' + item.description;
        });
        this.status = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.status = new DefaultSelect();
      },
    });
  }

  changeStatusGood(event: any) {}

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

  //getRecVault
}
