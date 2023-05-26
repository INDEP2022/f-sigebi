import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//Services
import { endOfDay, format, startOfDay } from 'date-fns';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
export interface IReport {
  data: File;
}

@Component({
  selector: 'app-reception-area-sera',
  templateUrl: './reception-area-sera.component.html',
  styles: [],
})
export class ReceptionAreaSeraComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();
  today: Date;

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  areas = new DefaultSelect<IDepartment>();
  areaValue: IDepartment;

  idDel: IDelegation;
  idSub: ISubdelegation;

  phaseEdo: number;

  get delegation() {
    return this.form.get('delegation');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService,
    private departamentService: DepartamentService,
    private siabService: SiabService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null], //noDelegation
      subdelegation: [null], //noSubDelegation
      departamentDes: [null], //noDepartament Destino
      delegationDes: [null], //noDelegation Destino
      subdelegationDes: [null], //noSubDelegation Destino
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      // fromMonth: ['', [Validators.required]],
      // toMonth: ['', [Validators.required]],
    });
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onDelegationsChange(element: any) {
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect();
    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
  }

  getAreas(params: ListParams) {
    this.departamentService.getAll(params).subscribe(
      data => {
        this.areas = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onValuesChange(areaChange: IDepartment) {
    this.idDel = areaChange.delegation as IDelegation;
    this.idSub = areaChange.numSubDelegation as ISubdelegation;
    console.log(areaChange);
    this.areaValue = areaChange;
    this.form.controls['delegationDes'].setValue(this.idDel.description);
    this.form.controls['subdelegationDes'].setValue(this.idSub.description);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  cleanForm(): void {
    this.form.reset();
  }

  confirm(): void {
    const { delegation, subdelegation, departamentDes, rangeDate } =
      this.form.value;

    const from = startOfDay(rangeDate[0]);
    const to = endOfDay(rangeDate[1]);
    this.loading = true;
    this.siabService
      .fetchReport('RCONDIRRECEPDOCTO', {
        PDELEGACION: delegation,
        PSUBDELEGACION: subdelegation,
        PDPTO: departamentDes,
        PFECHARECINI: format(from, 'yyyy-MM-dd'),
        PFECHARECFIN: format(to, 'yyyy-MM-dd'),
      })
      .subscribe({
        next: response => {
          this.loading = false;
          console.log('información del blob', response);
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (response: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        },
        error: err => {
          this.loading = false;
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }
          this.onLoadToast('error', 'Error', error);
        },
      });
  }
}
