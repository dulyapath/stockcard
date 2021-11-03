package utils;

import Model.MigrateTableModel;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Vector;

import Model.MigrateTableModel;
import Model.MigrateColumnModel;
import java.sql.PreparedStatement;
import javax.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;

public class MigrateDatabase {

    Vector<MigrateTableModel> tables;
    Vector<MigrateTableModel> tablesProvider;
    HttpSession session = null;

    StringBuilder logVerify = new StringBuilder();

    private void structTable() {
        tables = new Vector<MigrateTableModel>();
        tablesProvider = new Vector<MigrateTableModel>();

        MigrateTableModel SCDetail = new MigrateTableModel("sc_detail");

        SCDetail.addColumns(new MigrateColumnModel("roworder", "serial", "NOT NULL"));

        SCDetail.addColumns(new MigrateColumnModel("item_code", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("unit_code", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("wh_code", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("doc_date", "date"));
        SCDetail.addColumns(new MigrateColumnModel("doc_ref", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("doc_type", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("trans_type", "smallint", "DEFAULT 0"));
        SCDetail.addColumns(new MigrateColumnModel("qty", "numeric", "DEFAULT 0"));
        SCDetail.addColumns(new MigrateColumnModel("creator_code", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("remark", "character varying", 255));
        SCDetail.addColumns(new MigrateColumnModel("create_datetime", "timestamp without time zone", "DEFAULT now()"));

        SCDetail.addConstraint("sc_detail_pkey PRIMARY KEY (roworder)");
        tables.add(SCDetail);

        MigrateTableModel SCDocType = new MigrateTableModel("sc_doctype");

        SCDocType.addColumns(new MigrateColumnModel("roworder", "serial", "NOT NULL"));
        SCDocType.addColumns(new MigrateColumnModel("code", "character varying", 255, "NOT NULL"));
        SCDocType.addColumns(new MigrateColumnModel("trans_type", "smallint", "DEFAULT 0"));
        SCDocType.addColumns(new MigrateColumnModel("create_datetime", "timestamp without time zone", "DEFAULT now()"));
        SCDocType.addConstraint("sc_doctype_pk PRIMARY KEY (code)");
        tables.add(SCDocType);

        MigrateTableModel SCImportTemp = new MigrateTableModel("sc_import_temp");

        SCImportTemp.addColumns(new MigrateColumnModel("roworder", "serial", "NOT NULL"));
        SCImportTemp.addColumns(new MigrateColumnModel("doc_no", "character varying", 255, "NOT NULL"));
        SCImportTemp.addColumns(new MigrateColumnModel("doc_type", "character varying", 255));
        SCImportTemp.addColumns(new MigrateColumnModel("doc_ref", "character varying", 255));
        SCImportTemp.addColumns(new MigrateColumnModel("wh_code", "character varying", 255));
        SCImportTemp.addColumns(new MigrateColumnModel("doc_date", "date"));
        SCImportTemp.addColumns(new MigrateColumnModel("status", "numeric", "DEFAULT 0"));
        SCImportTemp.addColumns(new MigrateColumnModel("trans_type", "smallint", "DEFAULT 0"));
        SCImportTemp.addColumns(new MigrateColumnModel("remark", "character varying", 255));
        SCImportTemp.addColumns(new MigrateColumnModel("creator_code", "character varying", 255));
        SCImportTemp.addColumns(new MigrateColumnModel("create_datetime", "timestamp without time zone", "DEFAULT now()"));
        SCImportTemp.addConstraint("sc_import_temp_pk PRIMARY KEY (doc_no)");
        tables.add(SCImportTemp);

        MigrateTableModel SCImportDetailTemp = new MigrateTableModel("sc_import_detail_temp");

        SCImportDetailTemp.addColumns(new MigrateColumnModel("roworder", "serial", "NOT NULL"));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("doc_no", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("item_code", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("item_name", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("unit_code", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("qty", "numeric", "DEFAULT 0"));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("wh_code", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("trans_type", "smallint", "DEFAULT 0"));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("doc_date", "date"));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("remark", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("creator_code", "character varying", 255));
        SCImportDetailTemp.addColumns(new MigrateColumnModel("create_datetime", "timestamp without time zone", "DEFAULT now()"));
        SCImportDetailTemp.addConstraint("sc_import_detail_temp_pk PRIMARY KEY (roworder)");
        tables.add(SCImportDetailTemp);

        MigrateTableModel SCSetting = new MigrateTableModel("sc_setting");

        SCSetting.addColumns(new MigrateColumnModel("roworder", "serial", "NOT NULL"));
        SCSetting.addColumns(new MigrateColumnModel("code", "character varying", 255, "NOT NULL"));
        SCSetting.addColumns(new MigrateColumnModel("date_edit", "smallint", "DEFAULT 0"));
        SCSetting.addColumns(new MigrateColumnModel("create_datetime", "timestamp without time zone", "DEFAULT now()"));
        SCSetting.addConstraint("sc_setting_pk PRIMARY KEY (code)");

        SCSetting.addAfterScript("INSERT INTO sc_setting (code,date_edit) VALUES ('S001', 1)");

        tables.add(SCSetting);

    }

    public void verify(String provider, String dbname, HttpSession session) {
        this.session = session;
        verify(provider, dbname);
    }

    public void verify(String provider, String dbname) {
        Connection __conn = null;
        Connection __connProvider = null;

        structTable();
        dbname = dbname.toLowerCase();
        provider = provider.toLowerCase();

        _routine __routine = new _routine();

        __conn = __routine._connect(dbname, "SMLConfig" + provider.toUpperCase() + ".xml");
        __connProvider = __routine._connect("smlerpmain" + provider);

        try {

            for (MigrateTableModel table : tables) {
                verifyTable(__conn, table);
            }

            for (MigrateTableModel table : tablesProvider) {
                verifyTable(__connProvider, table);
            }
            afterScript(__connProvider);

        } finally {
            logStatus("complete", "", 1);

            if (__conn != null) {
                try {
                    __conn.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }

            if (__connProvider != null) {
                try {
                    __connProvider.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }

    }

    private void afterScript(Connection __conn) {
        try {
            String sqlCheck = "SELECT module_code FROM sml_web_module WHERE module_code = 'settings'";

            PreparedStatement stmt = __conn.prepareStatement(sqlCheck);
            ResultSet rs = stmt.executeQuery();

            boolean valNotExists = true;
            while (rs.next()) {
                valNotExists = false;
            }

            if (valNotExists) {
                String afterScript = "DELETE FROM sml_web_module WHERE web_flag=1;";
                afterScript += "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'cargroup', 'รหัสรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'carmaster', 'รายละเอียดรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'carstatus', 'สถานะรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'cartype', 'ประเภทรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'tmsroute', 'จัดการเส้นทาง', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'drivermaster', 'จัดการพนักงานขนส่ง', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'maintanance', 'Maintanance', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'oil', 'Oil', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'routedetails', 'การเดินรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'shipment', 'คิวส่งสินค้า', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'shipmentapprove', 'ปล่อยรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'shipmentcancel', 'ยกเลิก', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'shipmentfinished', 'ปิดจ๊อบ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'trucktracking', 'ติดตามรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'shipmentreport', 'รายงานตรวจสอบ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'reasonque', 'เหตุผลจัดคิว', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'reasonapprove', 'เหตุผลปล่อยรถ', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'reasonclosejob', 'เหตุผลปิดjob', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'permission', 'จัดการสิทธิ์', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'group', 'กลุ่มผู้ใช้งาน', '0', '1');"
                        + "INSERT INTO sml_web_module (module_code,module_name,is_disable,web_flag) VALUES ( 'settings', 'ตั้งค่า', '0', '1');";

                PreparedStatement stmtBeforeScript = __conn.prepareStatement(afterScript);
                stmtBeforeScript.executeUpdate();
            }

        } catch (SQLException ex) {
//            ex.printStackTrace();
        }
    }

    private void verifyTable(Connection __conn, MigrateTableModel table) {

        try {
            PreparedStatement stmtBeforeScript = __conn.prepareStatement(table.getAfterScript());
            stmtBeforeScript.executeUpdate();
        } catch (SQLException ex) {

        }

        try {

            String sqlCheckTable = "";

            JSONObject logTable = new JSONObject();

            sqlCheckTable = "SELECT table_name FROM information_schema.tables WHERE table_name = '" + table.getTableName() + "';";
            PreparedStatement stmt = __conn.prepareStatement(sqlCheckTable);
            ResultSet rs = stmt.executeQuery();

            table.setExists(false);
            while (rs.next()) {
                table.setExists(true);
            }
            rs.close();
            stmt.close();

            if (table.isExists()) {
                logStatus("t", table.getTableName(), 1);
                verifyColumn(__conn, table);
            } else {

                PreparedStatement stmtTable = __conn.prepareStatement(table.getCreateTableScript());
                stmtTable.executeUpdate();
                stmtTable.close();

                PreparedStatement stmtAfterScript = __conn.prepareStatement(table.getAfterScript());
                stmtAfterScript.executeUpdate();

                logStatus("t", table.getTableName(), 1);
            }

            String indexsScript = table.getAddIndexScript();

            if (!indexsScript.equals("")) {
                try {
                    PreparedStatement stmtIndexs = __conn.prepareStatement(indexsScript);
                    stmtIndexs.executeUpdate();
                } catch (SQLException e) {

                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            logStatus("t", table.getTableName(), 0);
            logStatus("sql_err", e.getMessage(), 0);
        }
    }

    private void verifyColumn(Connection __conn, MigrateTableModel table) {

        String columnLastCheck = "";
        try {

            String sqlCheckColumn = "";

            sqlCheckColumn = "SELECT column_name FROM information_schema.columns WHERE table_name = '" + table.getTableName() + "'";
            Statement stmtCol = __conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rsCol = stmtCol.executeQuery(sqlCheckColumn);

            Vector<String> colExists = new Vector<String>();

            while (rsCol.next()) {
                colExists.add(rsCol.getString("column_name"));
            }

            rsCol.close();
            stmtCol.close();

            for (MigrateColumnModel column : table.getColumns()) {
                column.setExists(colExists.contains(column.getName()));
                if (!column.isExists()) {
                    columnLastCheck = column.getName();

                    Statement stmtColAdd = __conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                    stmtColAdd.executeUpdate(column.getAddColumnScript(table.getTableName()));
                    stmtColAdd.close();

                    logStatus("c", column.getName(), 1);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            logStatus("c", columnLastCheck, 0);
            logStatus("sql_err", e.getMessage(), 0);
        }
    }

    private void sessionLog() {
        if (session != null) {
            session.setAttribute("verify_log", logVerify.toString());
        }
    }

    private void logStatus(String code, String msg, int status) {
        logVerify.append(code + "," + msg + "," + status + "\n");
        sessionLog();
    }

}
