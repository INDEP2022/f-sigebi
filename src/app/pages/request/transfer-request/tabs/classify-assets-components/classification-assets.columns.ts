import { SaeInputComponent } from '../compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';

export const REQUEST_OF_ASSETS_COLUMNS = {
  /*select: {
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
  id: {
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
    title: 'Descripción Bien INDEP',
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
    title: 'Tipo de Bien',
    type: 'string',
    sort: false,
  },
  codeFracction: {
    title: 'Fracción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad de la Transferente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => Number(value),
  },
  measureUnitTransferent: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },
  measureUnitLigie: {
    title: 'Unidad de Medida Ligie',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  descriptionPhysicalStatus: {
    title: 'Estado Físico',
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
