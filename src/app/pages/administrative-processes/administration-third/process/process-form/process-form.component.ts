import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStrategyProcess } from 'src/app/core/models/ms-strategy-process/strategy-process.model';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styles: [],
})
export class ProcessFormComponent extends BasePage implements OnInit {
  processForm: ModelForm<IStrategyProcess>;
  process: IStrategyProcess;

  title: string = 'Procesos';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private processService: StrategyProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.processForm = this.fb.group({
      description: [null, [Validators.required]],
      desShort: [null, []],
      nbOrigin: [null, []],
      processNumber: [null, []],
      programmingType: [null, []],
      registryNumber: [null, []],
      relayEstate: [null, []],
      relayStrategy: [null, []],
    });

    if (this.process != null) {
      this.edit = true;
      this.processForm.patchValue(this.process);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const data: IStrategyProcess = this.processForm.value;

    const req: IStrategyProcess = {
      description: data.description,
      desShort: data.desShort,
      programmingType: data.programmingType,
      relayEstate: data.relayEstate,
      relayStrategy: data.relayStrategy,
    };

    this.processService.create(req).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    const data: IStrategyProcess = this.processForm.value;

    const req: IStrategyProcess = {
      description: data.description,
      desShort: data.desShort,
      programmingType: data.programmingType,
      relayEstate: data.relayEstate,
      relayStrategy: data.relayStrategy,
    };

    this.processService.update(req, this.process.processNumber).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  // onValuesChange(zoneContractChange: IZoneContract) {
  //   if (this.contract) {
  //     this.contract.zoneContractKey = zoneContractChange.id;
  //   }
  // }

  // getZoneContracts(params: ListParams) {
  //   this.zoneContractService.getAll(params).subscribe({
  //     next: data =>
  //       (this.zoneContracts = new DefaultSelect(data.data, data.count)),
  //   });
  // }
}
