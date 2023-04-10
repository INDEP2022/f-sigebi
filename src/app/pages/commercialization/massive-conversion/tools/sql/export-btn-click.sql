DECLARE
   f_ARCHIVO      Text_IO.File_Type;
   c_ARCH_DEST    VARCHAR2(500);
   c_DATO         VARCHAR2(500);
   c_RFC          COMER_CLIENTES.RFC%TYPE;
   n_LOTE_PUBLICO COMER_LOTES.LOTE_PUBLICO%TYPE;
   c_CREADOPOR    VARCHAR2(50);
BEGIN
   GO_BLOCK('COMER_REF_GARANTIAS');
   FIRST_RECORD;
   IF :COMER_REF_GARANTIAS.ID_EVENTO IS NOT NULL THEN
      BEGIN
         c_ARCH_DEST := ABRIR_EXCEL_CSV('W', 'C');
         SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
         f_ARCHIVO   := TEXT_IO.FOPEN(C_ARCH_DEST, 'W');
         TEXT_IO.PUT_LINE(f_ARCHIVO, 'RFC,EVENTO,LOTE,LINEA_CAPTURA,MONTO,NO_CHEQUE,EXP_CHEQUE,FECVIGENCIA,CreadoPor');
         LOOP
            SELECT RFC
              INTO c_RFC
              FROM COMER_CLIENTES
             WHERE ID_CLIENTE = :COMER_REF_GARANTIAS.ID_CLIENTE;
             
            SELECT LOTE_PUBLICO
              INTO n_LOTE_PUBLICO
              FROM COMER_LOTES
             WHERE ID_LOTE = :COMER_REF_GARANTIAS.ID_LOTE;
            BEGIN
               SELECT USR_INSERT
                 INTO c_CREADOPOR
                 FROM TMP_LC_COMER
                WHERE ID_LOTE = :COMER_REF_GARANTIAS.ID_LOTE
                  AND NO_CHEQUE = :COMER_REF_GARANTIAS.NO_CHEQUE
                  AND BANCO_EXP_CHEQUE = :COMER_REF_GARANTIAS.BANCO_EXP_CHEQUE;
            EXCEPTION
               WHEN OTHERS THEN
                  c_CREADOPOR := 'NO ENCONTRADO';
            END;
            TEXT_IO.PUT_LINE(f_ARCHIVO, '"'||c_RFC||'",'||
                                        TO_CHAR(:COMER_REF_GARANTIAS.ID_EVENTO)||','||
                                        TO_CHAR(n_LOTE_PUBLICO)||','||
                                        '"=""'||:COMER_REF_GARANTIAS.REF_GSAE||:COMER_REF_GARANTIAS.REF_GBANCO||'"""'||',"'||
                                        TO_CHAR(:COMER_REF_GARANTIAS.MONTO,'9,999,999,999.00')||'",'||
                                        TO_CHAR(:COMER_REF_GARANTIAS.NO_CHEQUE)||',"'||
                                        :COMER_REF_GARANTIAS.BANCO_EXP_CHEQUE||'","'||
                                        TO_CHAR(:COMER_REF_GARANTIAS.FEC_VIGENCIA,'DD/MM/YYYY')||'","'||
                                        c_CREADOPOR||'"');
            EXIT WHEN :SYSTEM.LAST_RECORD = 'TRUE';
            NEXT_RECORD;
         END LOOP;
         FIRST_RECORD;
         TEXT_IO.FCLOSE(f_ARCHIVO);
         f_ARCHIVO := TEXT_IO.FOPEN('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\IMGSFOTSIAB.BAT', 'W');
         TEXT_IO.PUT_LINE(f_ARCHIVO, 'Start "" "'||c_ARCH_DEST||'"');
         TEXT_IO.FCLOSE(f_ARCHIVO);
         SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
         HOST('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\IMGSFOTSIAB.BAT',NO_SCREEN);
      EXCEPTION
         WHEN OTHERS THEN
            SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
            LIP_MENSAJE('ERR LC:. '||sqlerrm,'A');
      END;
   END IF;
END;