import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [
  ]
})
export class RequestRecordTabComponent extends BasePage implements OnInit {
  receptionForm: ModelForm<IRequest>;

  constructor(
    public fb:FormBuilder
  ) {
    super();
   }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm():void{
    this.receptionForm = this.fb.group({
      priority:[null]
    });
  }

}
