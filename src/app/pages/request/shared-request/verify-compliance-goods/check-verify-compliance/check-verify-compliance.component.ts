import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-check-verify-compliance',
  templateUrl: './check-verify-compliance.component.html',
  styles: ['.check-icon { color: #9d2449 !important }'],
})
export class CheckVerifyComplianceComponent
  extends BasePage
  implements OnInit, AfterViewInit {
  checkForm: FormGroup = new FormGroup({});
  checkState: boolean = false;
  checkbox: any;
  checkStateEditForm: boolean = false;
  @Input() value: string | number;
  @Input() rowData: any;
  @Input() checkId: string = 'checkbox';
  field: string = 'checkbox';

  requestId: number = null;
  process = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {

    this.requestId = Number(this.route.snapshot.paramMap.get('request'));
    this.process = this.route.snapshot.paramMap.get('process');

    this.field = this.checkId + "";
    this.checkId = this.checkId + this.rowData.good.id.toString();
    if (this.process != 'approve-return-request') {
      this.checkStateEditForm = true;
      this.prepareForm();
    } else {
      this.checkStateEditForm = false;
    }
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.changeState();
  }

  private prepareForm(): void {
    this.checkForm = this.fb.group({
      type: [''],
    });
  }

  changeState() {
    this.checkbox = document.querySelector(
      '#' + this.checkId
    ) as HTMLInputElement;
    if (this.checkbox) {
      this.checkbox.checked = this.rowData.check;
    }
  }

  change(event: Event) {
    this.checkbox = document.querySelector(
      '#' + this.checkId
    ) as HTMLInputElement;
    this.checkbox.checked = this.rowData[this.field];
    let action: string;
    this.rowData[this.field]
      ? (action = 'Quitar Permiso')
      : (action = 'Otorgar Permiso');
    this.alertQuestion(
      'question',
      '¿Está seguro que desea cambiar los permisos de este usuario?',
      '',
      action
    ).then(question => {
      if (question.isConfirmed) {
        this.rowData[this.field] = !this.rowData[this.field];
        this.checkbox.checked = this.rowData[this.field];
      }
    });
  }



}
