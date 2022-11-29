import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-check-verify-compliance',
  templateUrl: './check-verify-compliance.component.html',
  styles: [],
})
export class CheckVerifyComplianceComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  checkForm: FormGroup = new FormGroup({});
  checkState: boolean = false;
  checkbox: any;
  @Input() checkId: string = 'checkbox';
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.checkId = this.checkId + this.rowData._id.toString();
  }

  ngAfterViewInit(): void {
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
    this.checkbox.checked = this.checkState;
  }

  change(event: Event) {
    this.checkbox = document.querySelector(
      '#' + this.checkId
    ) as HTMLInputElement;
    this.checkbox.checked = this.checkState;
    let action: string;
    this.checkState
      ? (action = 'Quitar Permiso')
      : (action = 'Otorgar Permiso');
    this.alertQuestion(
      'question',
      '¿Está seguro que desea cambiar los permisos de este usuario?',
      '',
      action
    ).then(question => {
      if (question.isConfirmed) {
        this.checkState = !this.checkState;
        this.checkbox.checked = this.checkState;
      }
    });
  }
}
