import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  id: {
    title: 'Id Avalúo',
    sort: false,
  },
  appraisalKey: {
    title: 'Clave Avalúo',
    sort: false,
  },
  cveOffice: {
    title: 'Clave Oficio',
    sort: false,
  },
  insertDate: {
    title: 'Insertar Fecha',
    sort: false,
  },
};

export const COLUMNS2 = {
  idDetAppraisal: {
    title: 'No.',
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
    title: 'Superfice Terreno',
    sort: false,
  },
  surfaceConstru: {
    title: 'Superfice Construcción',
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
    title: 'Porcentaje Valor Otros',
    sort: false,
  },
  vri: {
    title: 'Valor de Referencia o de Avalúo',
    sort: false,
  },
  vTerrain: {
    title: 'Valor Terreno',
    sort: false,
  },
  vConstruction: {
    title: 'Valor Construcción Habitacional',
    sort: false,
  },
  vConstructionEat: {
    title: 'Valor Construcción Comercial',
    sort: false,
  },
  vInstallationsEsp: {
    title: 'Valor Instalaciones Especiales',
    sort: false,
  },
  vOthers: {
    title: 'Valor Otros',
    sort: false,
  },
  product: {
    title: 'Valor Total Calculado sin Iva',
    sort: false,
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
  },
  ivaHousing: {
    title: 'Iva Construcción Habitacional',
    sort: false,
  },
  ivaCommercial: {
    title: 'Iva Construcción Comercial',
    sort: false,
  },
  ivaSpecial: {
    title: 'Iva Instancias Especiales',
    sort: false,
  },
  ivaOthers: {
    title: 'Iva Otros',
    sort: false,
  },
  valueIvaTotalCalculated: {
    title: 'Valor Total de Iva Calculado',
    sort: false,
  },
  totalAccount: {
    title: 'Valor con Iva Icluido',
    sort: false,
  },
  observation: {
    title: 'Observación',
    sort: false,
  },
  validIVA: {
    title: 'Validación IVA',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  confirm: {
    title: 'Confirmado',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
