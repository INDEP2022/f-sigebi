PROCEDURE GENERA_ARCHIVO IS
   L_PATH              VARCHAR2(4000);
   vc_filtro           VARCHAR2(200);
   LFiarchivo          Text_IO.File_Type;
   LSt_archivo_destino VARCHAR2(4000);
   lnu_reg_act         NUMBER(10);
   lnu_ciclo           NUMBER(1);
   V_DESC_NUM          BIENES.DESCRIPCION%TYPE;
   V_ESTATUS_NUM       BIENES.ESTATUS%TYPE;
   V_MONEDA_NUM        BIENES.VAL1%TYPE;
   V_INGRESO_NUM       BIENES.VAL2%TYPE;
   V_IVA_NUM           BIENES.VAL10%TYPE;
   V_GASTO_NUM         BIENES.VAL13%TYPE;
   V_VALOR_AVALUO_NUM  BIENES.VALOR_AVALUO%TYPE;
BEGIN
   BEGIN
      LFiarchivo := Text_IO.Fopen('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\siabexcelpathrastr.pth', 'r');
      IF Text_IO.Is_Open(LFiarchivo) then 
         Text_IO.get_Line(LFiarchivo, L_PATH);
         Text_IO.fclose(LFiarchivo);
      END IF;
   EXCEPTION
      WHEN OTHERS THEN
         l_path := 'c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\';
   END;
   vc_filtro := 'Todos (*.*)|*.*|';
   vc_filtro := 'Archivos de Microsoft Excel (*.xls)|*.xls|';
   LSt_archivo_destino := 'c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\hoja1.xls';
   L_PATH := Get_path_name(LSt_archivo_destino);
   LFiarchivo := Text_IO.Fopen('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\siabexcelpathrastr.pth', 'w');
   Text_IO.Put_Line(LFiarchivo, L_PATH);  
   Text_IO.fclose(LFiarchivo);
   BEGIN
      LSt_archivo_destino := REPLACE(LOWER(LSt_archivo_destino), 'xls', 'csv'); 
      LFiarchivo := Text_IO.Fopen(LSt_archivo_destino, 'w');
      Text_IO.Put_Line(LFiarchivo,'NO_BIEN,DESCRIPCION,ESTATUS,INGRESO,GASTO,IVA,VALOR_CALC,NO_BIEN_NUM,DESCRIPCION_NUM,ESTATUS_NUM,CVE_EVENTO,MONEDA_NUM,INGRESO_NUM,IVA_NUM,GASTO_NUM,VALOR_AVALUO_NUM');  
      GO_BLOCK('BLK_BIENES');
      lnu_reg_act := :SYSTEM.cursor_record;
      FIRST_RECORD;
      IF :BLK_BIENES.NO_BIEN IS NOT NULL THEN
         LOOP
            IF :BLK_BIENES.IND_NUME = 3 THEN
               BEGIN
                  SELECT DESCRIPCION,
                         ESTATUS,
                         VAL1,
                         VAL2,
                         VAL10,
                         VAL13,
                         VALOR_AVALUO
                    INTO V_DESC_NUM,
                         V_ESTATUS_NUM,
                         V_MONEDA_NUM,
                         V_INGRESO_NUM,
                         V_IVA_NUM,
                         V_GASTO_NUM,
                         V_VALOR_AVALUO_NUM
                    FROM BIENES
                   WHERE NO_BIEN = :BLK_BIENES.NO_BIEN_NUME;
               EXCEPTION
                  WHEN OTHERS THEN
                     V_DESC_NUM := NULL;
                     V_ESTATUS_NUM := NULL;
                     V_MONEDA_NUM := NULL;
                     V_INGRESO_NUM := NULL;
                     V_IVA_NUM := NULL;
                     V_GASTO_NUM := NULL;
                     V_VALOR_AVALUO_NUM := NULL;
               END;
               Text_IO.Put_Line(LFiarchivo,NVL(TO_CHAR(:BLK_BIENES.NO_BIEN),'')||','||
                                           '"'||:BLK_BIENES.DESCRIPCION||'",'||
                                           '"'||:BLK_BIENES.ESTATUS||'",'||
                                           NVL(TO_CHAR(:BLK_BIENES.INGRESO),'')||','||
                                           NVL(TO_CHAR(:BLK_BIENES.GASTO),'')||','||
                                           NVL(TO_CHAR(:BLK_BIENES.IVA),'')||','||
                                           NVL(TO_CHAR(:BLK_BIENES.VALOR_AVALUO),'')||','||
                                           NVL(TO_CHAR(:BLK_BIENES.NO_BIEN_NUME),'')||','||
                                           '"'||V_DESC_NUM||'",'||
                                           '"'||V_ESTATUS_NUM||'",'||
                                           '"'||:BLK_BIENES.CVE_PROCESO||'",'||
                                           '"'||V_MONEDA_NUM||'",'||
                                           NVL(V_INGRESO_NUM,'')||','||
                                           NVL(V_IVA_NUM,'')||','||
                                           NVL(V_GASTO_NUM,'')||','||
                                           NVL(TO_CHAR(V_VALOR_AVALUO_NUM),''));
            END IF;
            EXIT WHEN :SYSTEM.LAST_RECORD = 'TRUE';
            NEXT_RECORD;
         END LOOP;	
      END IF;
      GO_RECORD(lnu_reg_act);
      Text_IO.fclose(LFiarchivo);
      -- Generar un archivo bat, con el dir de las imágenes con la ruta global
      LFiarchivo := Text_IO.Fopen('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\archonume.bat', 'w');
      Text_IO.Put_Line(LFiarchivo, 'Start "" "'||LSt_archivo_destino||'"');  
      Text_IO.fclose(LFiarchivo);
      -- Ejecutar el archivo bat generado     
      Lip_mensaje('Se abrirá el archivo en Excel, una vez abierto, en el menú "Archivo\Guardar como...", proceda a guardarlo como libro de MS Excel.','A');
      Host('c:\siabtmp\'||:GLOBAL.VG_DIRUSR||'\archonume.bat',NO_SCREEN);  
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         lip_mensaje('No se puede copiar el archivo de excel.','A');
   END;	
END;