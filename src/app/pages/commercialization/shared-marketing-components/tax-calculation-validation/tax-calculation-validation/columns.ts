export const COLUMNS = {
  id: {
    title: 'No. Avalúo',
    sort: false,
  },
  appraisalKey: {
    title: 'Cve. Avalúo',
    sort: false,
  },
  cveOffice: {
    title: 'Cve. Oficio',
    sort: false,
  },
  insertDate: {
    title: 'Insertar Fecha',
    sort: false,
  },
};

export const COLUMNS2 = {
  idDetAppraisal: {
    title: 'No. Avalúo',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  goodClassNumber: {
    title: 'Clasificación',
    sort: false,
  },
  desc_tipo: {
    title: 'Tipo',
    sort: false,
  },
  appraisalDate: {
    title: 'Fecha',
    sort: false,
  },
  vigAppraisalDate: {
    title: 'Fecha Vigencia',
    sort: false,
  },
  nameAppraiser: {
    title: 'Nombre Valuador',
    sort: false,
  },
  refAppraisal: {
    title: 'Tipo Referencia',
    sort: false,
  },
  terrainSurface: {
    title: 'Superficie Terreno',
    sort: false,
  },
  surfaceConstru: {
    title: 'Superficie Construcción',
    sort: false,
  },
  terrainPorcentage: {
    title: 'Porcentaje Terreno',
    sort: false,
  },
  porcentageHousing: {
    title: 'Porcentaje Valor Construcción Habitacional',
    sort: false,
  },
  porcentageCommercial: {
    title: 'Porcentaje Valor Construcción Comercial',
    sort: false,
  },
  porcentageSpecials: {
    title: 'Porcentaje Valor Instancias Especiales',
    sort: false,
  },
  porcentageOthers: {
    title: 'Porcentaje Valor Otros',
    sort: false,
  },
  porcentageTotal: {
    title: 'Porcentaje Total',
    sort: false,
  },
  vri: {
    title: 'Valor de Referencia o de Avalúo',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  vTerrain: {
    title: 'Valor Terreno',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  vConstruction: {
    title: 'Valor Construcción Habitacional',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  vConstructionEat: {
    title: 'Valor Construcción Comercial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  vInstallationsEsp: {
    title: 'Valor Instalaciones Especiales',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  vOthers: {
    title: 'Valor Otros',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  product: {
    title: 'Valor Total Calculado sin Iva',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  difference: {
    title: 'Diferencia',
    sort: false,
  },
  terrainRate: {
    title: 'Tasa Iva Terreno',
    sort: false,
  },
  rateHousing: {
    title: 'Tasa Iva Construcción Habitacional',
    sort: false,
  },
  rateCommercial: {
    title: 'Tasa Iva Construcción Comercial',
    sort: false,
  },
  rateSpecials: {
    title: 'Tasa Iva Instancias Especiales',
    sort: false,
  },
  rateOthers: {
    title: 'Tasa Iva Otros',
    sort: false,
  },
  terrainIva: {
    title: 'Iva Terreno',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  ivaHousing: {
    title: 'Iva Construcción Habitacional',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  ivaCommercial: {
    title: 'Iva Construcción Comercial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  ivaSpecial: {
    title: 'Iva Instancias Especiales',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  ivaOthers: {
    title: 'Iva Otros',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  valueIvaTotalCalculated: {
    title: 'Valor Total de Iva Calculado',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalAccount: {
    title: 'Valor con Iva Incluido',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  observation: {
    title: 'Observación',
    sort: false,
  },
  // validIVA: {
  //   title: 'Validación IVA',
  //   type: 'custom',
  //   sort: false,
  //   /*renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       data.row.to = data.toggle;
  //     });
  //   },*/
  //   renderComponent: CheckboxElementComponent,
  //   valuePrepareFunction: (isSelected: any, row: any) => {
  //     console.log('valuePrepareFunction -> ', row);
  //     return row.validIVA == 'N' ? true : false;
  //   },
  // },
  // confirm: {
  //   title: 'Confirmado',
  //   type: 'custom',
  //   sort: false,
  //   /*renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       data.row.to = data.toggle;
  //     });
  //   },
  //   renderComponent: CheckboxElementComponent,
  //   valuePrepareFunction: (isSelected: any, row: any) => {
  //     return row.abbreviation == 'N' ? true : false;
  //   },
  // },
};

export const COLUMNS3 = {
  totalRecords: {
    title: 'Total de Registros',
    sort: false,
  },
  totalAppraisal: {
    title: 'Total Valor de Referencia o Avalúo',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalTerrain: {
    title: 'Total Valor Terreno',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalHousing: {
    title: 'Total Valor Construcción Habitacional',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalCommercial: {
    title: 'Total Valor Construcción Comercial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalSpecial: {
    title: 'Total Valor Instalaciones Especiales',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalOthers: {
    title: 'Total Valor Otros',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  totalDifference: {
    title: 'Total Diferencia',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  valueCalculated: {
    title: 'Valor Total de Iva Calculado',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
  calueIncluding: {
    title: 'Valor con Iva Incluido',
    sort: false,
    type: 'html',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
    },
  },
};
