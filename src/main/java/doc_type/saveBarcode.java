package doc_type;

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

@WebServlet(name = "barcode-save", urlPatterns = {"/saveBarcode"})
public class saveBarcode extends HttpServlet {

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

        String _item_code = request.getParameter("item_code");
        String _unit_code = request.getParameter("unit_code");
        String _wh_code = request.getParameter("wh_code");
        String _doc_date = request.getParameter("doc_date");
        String _doc_ref = request.getParameter("doc_ref");
        String _doc_type = request.getParameter("doc_type");
        String _trans_type = request.getParameter("trans_type");
        String _qty = request.getParameter("qty");
        String _remark = request.getParameter("remark");
        String _creator_code =  request.getParameter("creator_code");;


        _routine __routine = new _routine();
        StringBuilder __result = new StringBuilder();

        try {
            Connection __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            PreparedStatement __stmt_insert = __conn.prepareStatement("insert into sc_detail (item_code,unit_code,wh_code,doc_date,doc_ref,doc_type,trans_type,qty,creator_code,remark) values "
                    + "('" + _item_code + "','" + _unit_code + "','" + _wh_code + "','" + _doc_date + "','" + _doc_ref + "','" + _doc_type + "','" + _trans_type + "','" + _qty + "','" + _creator_code + "','" + _remark + "')");
            __stmt_insert.executeUpdate();
            __stmt_insert.close();

            __conn.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print(e);
        }

        response.getWriter().print("success");
    }

}
