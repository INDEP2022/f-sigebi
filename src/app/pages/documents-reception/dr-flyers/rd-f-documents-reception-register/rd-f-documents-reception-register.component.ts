import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rd-f-documents-reception-register',
  templateUrl: './rd-f-documents-reception-register.component.html',
  styles: [],
})
export class RdFDocumentsReceptionRegisterComponent implements OnInit {
  documentsReceptionForm: ModelForm<any>;
  transfers = new DefaultSelect();
  identifiers = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.documentsReceptionForm = this.fb.group({
      type: [null, [Validators.required]],
      identifier: [null, [Validators.required]],
      sender: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      reception: [new Date(), [Validators.required]],
      priority: [null, [Validators.required]],
      flyer: [null, [Validators.required]],
      consecutive: [null, [Validators.required]],
      record: [null, [Validators.required]],
      recordId: [null],
      desalojov: [null],
      generalDirection: [false],
      judgmentType: [null],
      jobNumber: [null, [Validators.required]],
      jobDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
      expTransfer: [null],
      uniqueKey: [null],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      transfer: [null, [Validators.required]],
      court: [null],
      transmitter: [null, [Validators.required]],
      autority: [null, [Validators.required]],
      taxpayer: [null, [Validators.required]],
      receptionWay: [null, [Validators.required]],
      destinationArea: [null, [Validators.required]],
      destinationManagement: [null],
      inAtention: [null, [Validators.required]],
      cpp: [null],
      status: ['PENDIENTE'],
    });
  }
  sendFlyer() {}
  save() {}
}
