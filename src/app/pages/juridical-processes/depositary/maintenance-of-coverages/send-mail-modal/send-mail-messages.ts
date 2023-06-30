import * as moment from 'moment';

const p1 = (no_volante: number, expedient: number, preview: string = '') => {
  return `De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:
  
  ${preview.toLocaleLowerCase()}
  
  Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')} relacionado con el expediente ${expedient}.
  
  Lo anterior, con la finalidad de que en el ámbito de su competencia, obedezca el auto de suspensión debidamente notificado a este Organismo, toda vez que la omisión es sancionada en los términos del Código Penal aplicable en materia Federal para el delito de abuso de autoridad, por cuanto a la desobediencia cometida; independientemente de cualquier otro delito en que incurra (art. 206 de la Ley de Amparo).
  
  Atentamente
  
  Coordinación Fiscal y de Amparos`;
};

const p2 = (no_volante: number, expedient: number, preview: string = '') => {
  return `De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:

${preview.toLocaleLowerCase()}

Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')} , relacionado con el expediente ${expedient}.

En dicho acuerdo la autoridad competente negó la suspensión en los términos precisados en la notificación arriba citada; se recomienda que dichos bienes mantengan el mismo status que se encontraban hasta antes de esta notificación y esperar a que se resuelva en definitiva el juicio de amparo.

Atentamente

Coordinación Fiscal y de Amparos`;
};

const p3 = (no_volante: number, expedient: number, preview: string = '') => {
  return `De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')}, del expediente ${expedient}.

En donde la Justicia de la Nación amparó y protegió al quejoso, para los efectos precisados en el acuerdo antes citado, respecto de los siguientes bienes: 

${preview.toLocaleLowerCase()}

Atentamente

Coordinación Fiscal y de Amparos`;
};

const p4 = (no_volante: number, expedient: number, preview: string = '') => {
  return `De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')}, del expediente ${expedient}
    
    En donde la Justicia de la Nación no amparó, ni protegió al quejoso.
    
    Atentamente
    
    Coordinación Fiscal y de Amparos`;
};

const s1 = (no_volante: number, expedient: number, preview: string = '') => {
  return `<p style="text-align: justify;">De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:
   <br><br>
  ${preview.toLocaleLowerCase()}
  <br><br>
  Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')} relacionado con el expediente ${expedient}.
   <br><br> 
  Lo anterior, con la finalidad de que en el ámbito de su competencia, obedezca el auto de suspensión debidamente notificado a este Organismo, toda vez que la omisión es sancionada en los términos del Código Penal aplicable en materia Federal para el delito de abuso de autoridad, por cuanto a la desobediencia cometida; independientemente de cualquier otro delito en que incurra (art. 206 de la Ley de Amparo).
   <br><br> 
  Atentamente
   <br><br> 
  Coordinación Fiscal y de Amparos</p>`;
};

const s2 = (no_volante: number, expedient: number, preview: string = '') => {
  return `<div>De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:
<br><br>
${preview.toLocaleLowerCase()}
<br><br>
Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')} , relacionado con el expediente ${expedient}.
<br><br>
En dicho acuerdo la autoridad competente negó la suspensión en los términos precisados en la notificación arriba citada; se recomienda que dichos bienes mantengan el mismo status que se encontraban hasta antes de esta notificación y esperar a que se resuelva en definitiva el juicio de amparo.
<br><br>
Atentamente
<br><br>
Coordinación Fiscal y de Amparos</div>`;
};

const s3 = (no_volante: number, expedient: number, preview: string = '') => {
  return `<div>De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')}, del expediente ${expedient}.
<br><br>
En donde la Justicia de la Nación amparó y protegió al quejoso, para los efectos precisados en el acuerdo antes citado, respecto de los siguientes bienes: 
<br><br>
${preview.toLocaleLowerCase()}
<br><br>
Atentamente
<br><br>
Coordinación Fiscal y de Amparos</div>`;
};

const s4 = (no_volante: number, expedient: number, preview: string = '') => {
  return `<div>De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7º del ordenamiento invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ${no_volante} de Fecha ${moment(
    new Date()
  ).format('DD/MM/YYYY')}, del expediente ${expedient}
    <br><br>
    En donde la Justicia de la Nación no amparó, ni protegió al quejoso.
    <br><br>
    Atentamente
    <br><br>
    Coordinación Fiscal y de Amparos</div>`;
};
export { p1, p2, p3, p4, s1, s2, s3, s4 };
