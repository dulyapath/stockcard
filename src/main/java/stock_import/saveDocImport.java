package stock_import;

import doc_type.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DecimalFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONArray;
import org.json.JSONObject;
import utils._global;
import utils._routine;

@WebServlet(name = "docimport-save", urlPatterns = {"/saveDocImport"})
public class saveDocImport extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        HttpSession _sess = request.getSession();
        if (_sess.getAttribute("user") == null || _sess.getAttribute("user").toString().isEmpty()) {

            return;
        }

        String __user = _sess.getAttribute("user").toString().toUpperCase();
        String __dbname = _sess.getAttribute("dbname").toString().toLowerCase();
        String __provider = _sess.getAttribute("provider").toString().toLowerCase();

        String _doc_no = request.getParameter("doc_no");
        String _wh_code = request.getParameter("wh_code");
        String _doc_ref = request.getParameter("doc_ref");
        String _doc_type = request.getParameter("doc_type");
        String _trans_type = request.getParameter("trans_type");

        String _remark = request.getParameter("remark");
        String _creator_code = request.getParameter("creator_code");

        String data = request.getParameter("data");
        JSONArray jsonArray = new JSONArray(data);

        _routine __routine = new _routine();
        StringBuilder __result = new StringBuilder();

        StringBuilder _insert_sc_details_temp = new StringBuilder();
        StringBuilder _insert_sc_details = new StringBuilder();

        try {
            Connection __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            PreparedStatement __stmt_insert = __conn.prepareStatement("insert into sc_import_temp (doc_no,doc_type,doc_ref,wh_code,doc_date,trans_type,remark,creator_code) values "
                    + "('" + _doc_no + "','" + _doc_type + "','" + _doc_ref + "','" + _wh_code + "','now()','" + _trans_type + "','" + _remark + "','" + _creator_code + "')");
            __stmt_insert.executeUpdate();
            __stmt_insert.close();

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                _insert_sc_details_temp.append("insert into sc_import_detail_temp (doc_no,item_code,item_name,unit_code,qty,doc_date) values "
                        + "('" + _doc_no + "','" + obj.get("item_code") + "','" + obj.get("item_name") + "','" + obj.get("unit_code") + "'," + obj.get("qty") + ",'" + obj.get("doc_date") + "');");

                _insert_sc_details.append("insert into sc_detail (item_code,unit_code,wh_code,doc_date,doc_ref,doc_type,trans_type,qty,creator_code,remark) values "
                        + "('" + obj.get("item_code") + "','" + obj.get("unit_code") + "','" + _wh_code + "','" + obj.get("doc_date") + "','" + _doc_ref + "','" + _doc_type + "','" + _trans_type + "','" + obj.get("qty") + "','" + _creator_code + "','" + _remark + "');");
            }
            PreparedStatement __stmt_detail_temp = __conn.prepareStatement(_insert_sc_details_temp.toString());
            __stmt_detail_temp.executeUpdate();
            __stmt_detail_temp.close();
            PreparedStatement __stmt_detail = __conn.prepareStatement(_insert_sc_details.toString());
            __stmt_detail.executeUpdate();
            __stmt_detail.close();

            __conn.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print(e);
        }

        response.getWriter().print("success");
    }

}
