import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ContractService } from 'src/app/core/services/contract/strategy-contract.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-surveillance-reports',
  templateUrl: './surveillance-reports.component.html',
  styles: [],
})
export class SurveillanceReportsComponent extends BasePage implements OnInit {
  form: FormGroup;
  public providers = new DefaultSelect();
  DATA: any[] = [
    {
      label: 'ALTAS',
      value: 1,
    },
    {
      label: 'BAJAS',
      value: 2,
    },
    {
      label: 'MODIFICACIONES',
      value: 3,
    },
    {
      label: 'DESCUENTOS',
      value: 4,
    },
    {
      label: 'NOTAS DE CREDITO',
      value: 5,
    },
    {
      label: 'GENERAL',
      value: 6,
    },
    {
      label: 'SUPERVISORES',
      value: 7,
    },
  ];
  dataSelect = new DefaultSelect<any>(this.DATA, this.DATA.length);
  contracts = new DefaultSelect<any>();
  users = new DefaultSelect<any>();
  anioActual = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private contractService: ContractService,
    private serviceUser: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getContract({ limit: 10, page: 1 });
  }

  prepareForm() {
    this.form = this.fb.group({
      contract: [null, Validators.required],
      provider: [null, Validators.required],
      providerSign: [null, Validators.required],
      reports: [null, Validators.required],
      reportSae: [null, Validators.required],
      year: [null, [Validators.required, this.validarAnioActual.bind(this)]],
      month: [
        null,
        [Validators.required, Validators.pattern('^(0?[1-9]|1[0-2])$')],
      ],
      post: [null],
    });
  }

  validarAnioActual(control: any) {
    const añoIngresado = parseInt(control.value, 10);
    if (añoIngresado > this.anioActual) {
      return { añoFuturo: true };
    }
    return null;
  }

  getUsers(params: ListParams) {
    const routeUser = `?filter.name=$ilike:${params.text}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      this.users = new DefaultSelect(res.data, res.count);
    });
  }

  getContract(params: ListParams) {
    this.contractService.getContract(params).subscribe(data => {
      console.log(data);
      this.contracts = new DefaultSelect(data.data, data.count);
    });
  }

  print() {
    const params: any = {
      ANIO: this.form.get('year').value,
      MES: this.form.get('month').value,
      PFIRMA: null,
      PCONT: this.form.get('contract').value,
      PRESPRO: this.form.get('providerSign').value,
      P_PUESTO: this.form.get('post').value,
    };
    console.log(params);
    console.log(this.form.get('reports').value);
    if (this.form.get('reports').value === 1) {
      this.downloadReport('RREPVIGRALTAS2', params);
    } else if (this.form.get('reports').value === 2) {
      this.downloadReport('RREPVIGRALBAJAS2', params);
    } else if (this.form.get('reports').value === 3) {
      this.downloadReport('RREPVIGRALMODIF2', params);
    } else if (this.form.get('reports').value === 4) {
      this.downloadReport('blank', params);
    } else if (this.form.get('reports').value === 5) {
      this.downloadReport('RREPVIGRALNOTAS2', params);
    } else if (this.form.get('reports').value === 6) {
      this.downloadReport('blank', params);
    } else if (this.form.get('reports').value === 7) {
      this.downloadReport('blank', params);
    }
  }

  downloadReport(reportName: string, params: any) {
    //this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
      },
    });
  }

  onChangeContract(event: any) {
    console.log(event);
    this.form.get('provider').patchValue(event.supplier);
  }
  onChangeUser(user: any) {
    console.log(user);
    this.form.get('reportSae').patchValue(user.name);
  }
}
