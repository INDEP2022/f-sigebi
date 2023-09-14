import { SaeInputComponent } from '../../compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';

export const ASSETS_COLUMNS = {
  /*selected: {
    title: '',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
    hide: false,
  },*/
  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción de Bien Transferente',
    type: 'string',
    sort: false,
  },
  /* descriptionGoodSae: {
    title: 'Descripción de Bien INDEP',
    type: 'string',
    sort: false,
  }, */
  descriptionGoodSae: {
    title: 'Descripción Bien INDEP',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: SaeInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  descriptionRelevantType: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  codeFracction: {
    title: 'Fracción',
    type: 'string',
    sort: false,
    //valuePrepareFunction: (value: IFraccion) => (value ? value.code : ''),
  },
  quantity: {
    title: 'Cantidad de la Transferente',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => Number(value),
  },
  measureUnitLigie: {
    title: 'Unidad de Medida Ligie',
    type: 'string',
    sort: false,
  },
  measureUnitTransferent: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  descriptionPhysicalStatus: {
    title: 'Estado fisico',
    type: 'string',
    sort: false,
  },
  descriptionConservationStatus: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
  },
  descriptionDestiny: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },
  descriptionDestinyTransferent: {
    title: 'Destino Transferente',
    type: 'string',
    sort: false,
  },
};
