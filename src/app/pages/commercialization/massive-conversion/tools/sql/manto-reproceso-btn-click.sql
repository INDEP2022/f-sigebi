DECLARE
   n_CONT  PLS_INTEGER;
   c_WHERE VARCHAR2(100);
BEGIN
   SET_ITEM_PROPERTY('BLK_CONTREP.PB_REPROCESAR',ENABLED,PROPERTY_FALSE);
   IF :TMP_EVENTOS_COMER.ID_EVENTO IS NOT NULL THEN
      GO_BLOCK('COMER_REF_GARANTIAS1');
      CLEAR_BLOCK(NO_COMMIT);
      GO_BLOCK('TMP_EVENTOS_COMER');
      CLEAR_BLOCK;
   END IF;
   IF :BLK_CONTROL.ID_EVENTO IS NOT NULL THEN
      BEGIN
         /* >> JACG 08-01-19 Se ajusta la validación en base al nuevo parámetro de indicador de fallo.
         SELECT COUNT(0)
           INTO n_CONT
           FROM COMER_EVENTOS
          WHERE ID_EVENTO = TO_NUMBER(:BLK_CONTROL.ID_EVENTO)
            --AND (ID_ESTATUSVTA IN ('PREP', 'PUB', 'ACT') OR (ID_ESTATUSVTA = 'VEN' AND ID_TPEVENTO IN (1,2)));
            AND (ID_ESTATUSVTA IN ('PREP', 'PUB', 'ACT') OR (ID_ESTATUSVTA = 'VEN'  AND (ID_TPEVENTO IN (1,2) OR (DIRECCION = 'I' AND ID_TPEVENTO = 4)))); -- JACG 07-01-19 Se adiciona Inmuebles tipo 4 y 2 --*/
         SELECT COUNT(0)
           INTO n_CONT
           FROM COMER_EVENTOS CE, COMER_TPEVENTOS CT
          WHERE CE.ID_TPEVENTO = CT.ID_TPEVENTO
            AND ID_EVENTO = TO_NUMBER(:BLK_CONTROL.ID_EVENTO)
            AND DECODE(CE.DIRECCION,'I',NVL(MOD(CT.ID_TIPO_FALLO,10),5),NVL(TRUNC(CT.ID_TIPO_FALLO/10,0),5)) IN (1, 2)
            AND CE.ID_ESTATUSVTA IN ('PREP', 'PUB', 'ACT', 'VEN');
         /* << JACG 08-01-19 Se ajusta la validación en base al nuevo parámetro de indicador de fallo. */
      EXCEPTION
         WHEN OTHERS THEN
            n_CONT := 0;
      END;
      IF n_CONT = 0 THEN
         LIP_MENSAJE('Evento no válido para ingresar a este proceso.','S');
         RAISE FORM_TRIGGER_FAILURE;
      END IF;
      GO_BLOCK('TMP_EVENTOS_COMER');
      EXECUTE_QUERY;
      GO_BLOCK('COMER_REF_GARANTIAS1');
   ELSE
      GO_BLOCK('TMP_EVENTOS_COMER');
   END IF;
END;