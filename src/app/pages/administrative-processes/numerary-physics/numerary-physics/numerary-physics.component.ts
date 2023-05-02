import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';

@Component({
  selector: 'app-numerary-physics',
  templateUrl: './numerary-physics.component.html',
  styles: [],
})
export class NumeraryPhysicsComponent extends BasePage implements OnInit {
  public physicsForm: FormGroup;

  public delegations = new DefaultSelect();

  public get startedDate(): AbstractControl {
    return this.physicsForm.get('startedDate');
  }
  public get finishedDate(): AbstractControl {
    return this.physicsForm.get('finishedDate');
  }
  public get getDelegation(): AbstractControl {
    return this.physicsForm.get('delegation');
  }
  public get type(): AbstractControl {
    return this.physicsForm.get('type');
  }

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm(): void {
    this.physicsForm = this.fb.group({
      delegation: ['', Validators.required],
      startedDate: ['', Validators.required],
      finishedDate: ['', Validators.required],
      type: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  public send(): void {
    this.loading = true;
    // const pdfurl =
    //   `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGENADBNUMEFISICO.pdf?PARAMFORM=NO&PN_DELEG=` +
    //   this.physicsForm.controls['delegation'].value +
    //   `&PF_FECINI=` +
    //   this.datePipe.transform(
    //     this.physicsForm.controls['startedDate'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PF_FECFIN=` +
    //   this.datePipe.transform(
    //     this.physicsForm.controls['finishedDate'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PC_TIPO=` +
    //   this.physicsForm.controls['type'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.physicsForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      console.log(data);

      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }
}
