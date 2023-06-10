export const TRANSPORTABLE_GOODS = {
  id: {
    title: 'No gestión',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave única',
    type: 'string',
    sort: false,
  },

  fileNumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción transferente',
    sort: false,
  },

  descriptionSae: {
    title: 'Descripción INDEP',
    type: 'string',
    sort: false,
  },

  transferenceQuantity: {
    title: 'Cantidad transferente',
    type: 'string',
    sort: false,
  },

  saeAmmount: {
    title: 'Cantidad INDEP',
    type: 'string',
    sort: false,
  },

  transerUnit: {
    title: 'Unidad transferente',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad medida INDEP',
    type: 'string',
    sort: false,
  },

  physicalState: {
    title: 'Estado Físico transferente',
    type: 'string',
    sort: false,
  },

  physicalStateSae: {
    title: 'Estado Físico INDEP',
    type: 'string',
    sort: false,
  },

  transferConStatus: {
    title: 'Estado conversación transferente',
    type: 'string',
    sort: false,
  },

  convrsationConStatus: {
    title: 'Estado conversación INDEP',
    type: 'string',
    sort: false,
  },
};

export const TRANSPORTABLE_GOODS_FORMALIZE = {
  goodId: {
    title: 'NoX gestión',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave única',
    type: 'string',
    sort: false,
  },

  fileNumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción transferente',
    sort: false,
  },

  descriptionGoodSae: {
    title: 'Descripción INDEP',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad transferente',
    type: 'string',
    sort: false,
  },

  quantitySae: {
    title: 'Cantidad INDEP',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad Medida transferente',
    type: 'string',
    sort: false,
  },
  saeMeasureUnit: {
    title: 'Unidad medida INDEP',
    type: 'html',
    editor: {
      type: 'list',
      config: {
        list: [
          { value: 'KILOWATT', title: 'KILOWATT' },
          { value: 'HORA', title: 'HORA' },
          { value: 'BARRIL', title: 'BARRIL' },
          { value: 'GRAMO', title: 'GRAMO' },
          { value: 'METRO CUADRADO', title: 'METRO CUADRADO' },
          { value: 'METRO CÚBICO', title: 'METRO CÚBICO' },
          { value: 'MILLAR', title: 'MILLAR' },
          { value: 'PAR', title: 'PAR' },
          { value: 'KILOGRAMOS', title: 'KILOGRAMOS' },
          { value: 'METRO', title: 'METRO' },
          { value: 'PIEZA', title: 'PIEZA' },
          { value: 'CABEZA', title: 'CABEZA' },
          { value: 'LITRO', title: 'LITRO' },
        ],
      },
    },
    sort: false,
  },
  // sort: false,
  // type: 'html',
  //     valuePrepareFunction: (cell, row, companyList) => {

  //       // this.placeholder();
  //       let bn = this.measureTlUnit.find(x => x.value === cell);
  //       if (bn) {
  //         return bn.title;
  //       }
  //       else {

  //         return cell;
  //       }
  //     },
  //     editor: {
  //       type: 'list',
  //       config: {

  //         selectText: 'Select',
  //         list: this.saeMeasureUnit

  //       }
  //     }
  // },

  // type: 'select',
  // config: {
  //   selectText: 'Seleccionar',
  //   options: [
  //     { value: 'KILOWATT', title: 'KILOWATT' },
  //     { value: 'HORA', title: 'HORA' },
  //     { value: 'BARRIL', title: 'BARRIL' },
  //     { value: 'GRAMO', title: 'GRAMO' },
  //     { value: 'METRO CUADRADO', title: 'METRO CUADRADO' },
  //     { value: 'METRO CÚBICO', title: 'METRO CÚBICO' },
  //     { value: 'MILLAR', title: 'MILLAR' },
  //     { value: 'PAR', title: 'PAR' },
  //     { value: 'KILOGRAMOS', title: 'KILOGRAMOS' },
  //     { value: 'METRO', title: 'METRO' },
  //     { value: 'PIEZA', title: 'PIEZA' },
  //     { value: 'CABEZA', title: 'CABEZA' },
  //     { value: 'LITRO', title: 'LITRO' },
  //   ],
  // },
  // saeMeasureUnit:  {
  //   title: 'Unidad medida INDEP',
  //   type: 'html',
  //   sort: false,
  //   valuePrepareFunction: (value: string) => {
  //     if (value == '1')
  //       return '<strong><span class="badge badge-pill badge-success">Activo</span></strong>';
  //     if (value == '0')
  //       return '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
  //     return value;
  //   },
  //   filter: {
  //     type: 'list',
  //     config: {
  //       selectText: 'Seleccionar',
  //       list: [
  //         { value: '1', title: 'Activo' },
  //         { value: '0', title: 'Inactivo' },
  //       ],
  //     },
  //   },
  // },

  physicalStatusName: {
    title: 'Estado Físico transferente',
    type: 'string',
    sort: false,
  },

  saePhysicalState: {
    title: 'Estado Físico INDEP',
    type: 'string',
    sort: false,
  },

  stateConservationName: {
    title: 'Conservación transferente',
    type: 'string',
    sort: false,
  },

  stateConservationSae: {
    title: 'Estado conservación INDEP',
    type: 'string',
    sort: false,
  },
};
