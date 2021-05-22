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

@WebServlet(name = "doctype-update", urlPatterns = {"/updateDocType"})
public class updateDocType extends HttpServlet {

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

        String _code = request.getParameter("code");
        String _old_code = request.getParameter("old_code");
        String _trans_type = request.getParameter("trans_type");
        HttpSession session = request.getSession(true);

        StringBuilder _insert_trans_sale_temp = new StringBuilder();

        _routine __routine = new _routine();
        StringBuilder __result = new StringBuilder();

        try {
            Connection __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String query1 = "select code  from sc_doctype where code = '" + _code + "'";
            System.out.println("query1 " + query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();
            __rsHead.next();
            int row = __rsHead.getRow();
            //System.out.println("row " + row);
            if (row > 0) {
                if (_code.equals(_old_code)) {
                    PreparedStatement __stmt_delete = __conn.prepareStatement("delete from sc_doctype where code = '" + _old_code + "';");
                    __stmt_delete.executeUpdate();
                    __stmt_delete.close();
                    PreparedStatement __stmt_insert = __conn.prepareStatement("insert into sc_doctype (code,trans_type) values ('" + _code + "'," + _trans_type + ")");
                    __stmt_insert.executeUpdate();
                    __stmt_insert.close();
                } else {

                    response.getWriter().print("duplicate");
                    return;
                }
            } else {
                PreparedStatement __stmt_delete = __conn.prepareStatement("delete from sc_doctype where code = '" + _old_code + "';");
                __stmt_delete.executeUpdate();
                __stmt_delete.close();
                PreparedStatement __stmt_insert = __conn.prepareStatement("insert into sc_doctype (code,trans_type) values ('" + _code + "'," + _trans_type + ")");
                __stmt_insert.executeUpdate();
                __stmt_insert.close();
            }

            __conn.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print(e);
        }

        response.getWriter().print("success");
    }

}
