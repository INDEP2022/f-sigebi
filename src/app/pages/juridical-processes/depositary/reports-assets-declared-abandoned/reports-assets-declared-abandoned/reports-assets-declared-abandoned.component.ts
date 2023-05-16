import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../../../core/services/catalogs/delegation.service';
import { ERROR_REPORT } from '../utils/reports-assets-declared.message';
@Component({
  selector: 'app-reports-assets-declared-abandoned',
  templateUrl: './reports-assets-declared-abandoned.component.html',
  styles: [],
})
export class ReportsAssetsDeclaredAbandonedComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      dateInitRatification: [null, [Validators.required]],
      dateFinish: [null, [Validators.required]],
      ofFile: [
        '',
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      atFile: [
        '',
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      ofgood: [
        '',
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      atgood: [
        '',
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      capturingUser: [null, [Validators.required]],
    });
  }

  public getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }
  public getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      this.subdelegations = new DefaultSelect(data.data, data.count);
    });
  }

  cleanForm(): void {
    this.form.reset();
  }

  confirm(): any {
    let params = {
      PARAMFORM: 'NO',
      PN_DELEG: this.form.controls['delegation'].value,
      PN_SUBDEL: this.form.controls['subdelegation'].value,
      PF_FECINI: this.datePipe.transform(
        this.form.controls['dateInitRatification'].value,
        'yyyy-dd-MM hh:mm:ss'
      ),
      PF_FECFIN: this.datePipe.transform(
        this.form.controls['dateFinish'].value,
        'yyyy-dd-MM hh:mm:ss'
      ),
      PN_BIENINI: this.form.controls['ofgood'].value,
      PN_BIENFIN: this.form.controls['atgood'].value,
      PN_EXPEDINI: this.form.controls['ofFile'].value,
      PN_EXPEDFIN: this.form.controls['atFile'].value,
      PC_USUARIO: this.form.controls['capturingUser'].value,
    };
    this.siabService
      .fetchReport('RGERJURDECLARABAND', params)
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
  }
}
