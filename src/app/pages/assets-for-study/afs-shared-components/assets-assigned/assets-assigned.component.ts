import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-assets-assigned',
  templateUrl: './assets-assigned.component.html',
  styleUrls: ['./assets-assigned.component.scss'],
})
export class AssetsAssignedComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() typeComponent: any;
  @Input() isSaving: boolean = false;
  @Output() assetData = new EventEmitter<any>();

  assetAssignedForm: ModelForm<any>;
  isReadOnly: boolean = true;
  asignToSelected = new DefaultSelect();
  warehouseSelected = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSaving === true) {
      this.assetData.emit(this.assetAssignedForm.getRawValue());
    }
  }

  initForm(): void {
    if (this.typeComponent === 'save-answer') {
      this.isReadOnly = true;
    }
    this.assetAssignedForm = this.fb.group({
      assignedTo: [{ value: 'Cristian Antelo', disabled: true }],
      assetCharac: [{ value: 'Material de estdio', disabled: true }],
      transfer: [{ value: null, disabled: true }],
      reasonStudy: [{ value: 'Estudio de los bienes', disabled: true }],
      assetsClassify: [{ value: null, disabled: true }],
      warehouse: [{ value: null, disabled: true }],
      studyMange: [{ value: null, disabled: true }],
      expedient: [{ value: 1447, disabled: true }],

      //dato solo para prerar solicitud, revisar si el dato biene en un solo json
      projectRequest: [{ value: null, disabled: this.isReadOnly }],

      //datos extras solo para guardar respuesta de la responsable del estudio
      noRequest: [{ value: 124545, disabled: true }],
      receiver: [{ value: null, disabled: true }],
      recipientPosition: [{ value: null, disabled: true }],
      dateRequest: [{ value: null, disabled: true }],

      //datos de dictamen de bienes a ser estudiados
      meaningAnswer: [{ value: 'Positivo', disabled: true }],
      operationDayStart: [{ value: null, disabled: true }],
      operationDayEnd: [{ value: null, disabled: true }],
    });
  }

  getAsignToSelect(event: any) {}
  getWarehouseSelectedSelect(event: any) {}
}
