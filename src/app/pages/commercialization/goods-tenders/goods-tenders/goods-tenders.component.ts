import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BiddingService } from 'src/app/core/services/ms-bidding/bidding.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-tenders',
  templateUrl: './goods-tenders.component.html',
  styles: [],
})
export class GoodsTendersComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;

  dataDelegation = new DefaultSelect();
  dataSubDelegation = new DefaultSelect();
  dataBidding = new DefaultSelect();

  pdfurl =
    'http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf';

  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private msDelegationService: DelegationService,
    private msSubdelegationService: SubdelegationService,
    private msBiddingService: BiddingService
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      noBidding: [null, [Validators.required]],
      description: [null, [Validators.required]],
      PF_FECINI: [null, [Validators.required]],
      PF_FECFIN: [null, [Validators.required]],
    });
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
  confirm() {
    let params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      NO_LICITACION1: this.form.controls['noBidding'].value,
      DESC_LICIT: this.form.controls['description'].value,
      PF_FECINI: this.form.controls['PF_FECINI'].value,
      PF_FECFIN: this.form.controls['PF_FECFIN'].value,
    };
    console.log(params);

    const start = new Date(this.form.get('PF_FECINI').value);
    const end = new Date(this.form.get('PF_FECFIN').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'fecha de final no puede ser menor a fecha inicial'
      );
      return;
    }

    // setTimeout(() => {
    //   this.onLoadToast('success', 'procesando', '');
    // }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERDESLICITXBIEN.pdf?PN_DELEGACION=${params.PN_DELEGACION}&PN_SUBDELEGACION=${params.PN_SUBDELEGACION}&NO_LICITACION1=${params.NO_LICITACION1}&DESC_LICIT=${params.DESC_LICIT}&PF_FECINI=${params.PF_FECINI}&PF_FECFIN=${params.PF_FECFIN}`;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    // window.open(pdfurl, 'FGERDESLICITXBIEN.pdf');
    this.runReport();
    // this.loading = false;
    // this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }

  runReport() {
    this.loading = true;
    let params = {
      pn_delegacion: this.form.controls['delegation'].value,
      pn_subdelegacion: this.form.controls['subdelegation'].value,
      pn_no_licita: this.form.controls['noBidding'].value,
      pc_desc_licita: this.form.controls['description'].value,
      pf_fecini: this.form.controls['PF_FECINI'].value,
      pf_fecfin: this.form.controls['PF_FECFIN'].value,
    };
    this.siabService
      .fetchReport('RGERDESLICITXBIEN', params)
      .subscribe(response => {
        this.loading = false;
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
          console.log(response);
        }
      });
  }

  changeDelegation(event: any) {
    console.log(event);
    if (event) {
      // this.form.get('subdelegation').setValue(event);
      this.getSubDelegation(new ListParams());
    } else {
      this.form.get('subdelegation').setValue(null);
    }
  }

  getDelegation(paramsData: ListParams) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    params.search = paramsData['search'];
    // params['sortBy'] = 'name:ASC';
    let subscription = this.msDelegationService
      .getAllPaginated(params.getParams())
      .subscribe({
        next: data => {
          this.dataDelegation = new DefaultSelect(data.data, data.count);
          console.log(data, this.dataDelegation);
          subscription.unsubscribe();
        },
        error: error => {
          this.dataDelegation = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  getSubDelegation(paramsData: ListParams) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    if (!this.form.controls['delegation'].value) {
      this.dataSubDelegation = new DefaultSelect();
      return;
    }
    params.removeAllFilters();
    params.search = paramsData['search'];
    params.addFilter(
      'delegationNumber',
      this.form.controls['delegation'].value
    );
    let subscription = this.msSubdelegationService
      .getAll(params.getParams())
      .subscribe({
        next: data => {
          this.dataSubDelegation = new DefaultSelect(data.data, data.count);
          console.log(data, this.dataSubDelegation);
          subscription.unsubscribe();
        },
        error: error => {
          this.dataSubDelegation = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeBidding(event: any) {
    console.log(event);
    if (event) {
      this.form.get('description').setValue(event);
    } else {
      this.form.get('description').setValue(null);
    }
  }

  getBidding(paramsData: ListParams) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    params.search = paramsData['search'];
    let subscription = this.msBiddingService
      .getAllTenders(params.getParams())
      .subscribe({
        next: data => {
          this.dataBidding = new DefaultSelect(data.data, data.count);
          console.log(data, this.dataBidding);
          subscription.unsubscribe();
        },
        error: error => {
          this.dataBidding = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }
}
