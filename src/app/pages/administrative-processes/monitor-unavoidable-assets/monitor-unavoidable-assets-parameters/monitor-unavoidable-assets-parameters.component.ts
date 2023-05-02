import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-monitor-unavoidable-assets-parameters',
  templateUrl: './monitor-unavoidable-assets-parameters.component.html',
  styles: [],
})
export class MonitorUnavoidableAssetsParametersComponent
  extends BasePage
  implements OnInit
{
  parametersForm: ModelForm<any>;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {
    super();
    this.prepareForm();
  }
  ngOnInit(): void {}
  private prepareForm() {
    this.parametersForm = this.fb.group({
      waterproofPercentage: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(7)]),
      ],
      monthsIncosteability: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(4)]),
      ],
      unaffordableMinimunWage: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(17)]),
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //guaradar datos
  }
}
