package stock_import;

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

@WebServlet(name = "import-doclistdetail", urlPatterns = {"/getDocImportDetail"})
public class getDocImportDetail extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        StringBuilder __html = new StringBuilder();

        HttpSession _sess = request.getSession();
        String keyword = "", barcode = "";

        DecimalFormat decim = new DecimalFormat("#,###.##");

        if (_sess.getAttribute("user") == null || _sess.getAttribute("user").toString().isEmpty()) {

            return;
        }

        String __user = _sess.getAttribute("user").toString().toUpperCase();
        String __dbname = _sess.getAttribute("dbname").toString().toLowerCase();
        String __provider = _sess.getAttribute("provider").toString().toLowerCase();
        String search = "";

        String _doc_no = request.getParameter("docno");

        JSONArray jsarrDetailx = new JSONArray();
        JSONObject objmain = new JSONObject();
        Connection __conn = null;
        try {
            _routine __routine = new _routine();
            __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String __queryExtend = "";
            String _code = "";
            String _name = "";

            String query1 = "select *,(select name_1 from ic_warehouse where code = wh_code) as wh_name,(select name_1 from erp_user where code = creator_code )as creator_name from sc_import_temp where doc_no='" + _doc_no + "'";
            System.out.println("query1 " + query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();
            while (__rsHead.next()) {

                objmain.put("doc_no", __rsHead.getString("doc_no"));
                objmain.put("doc_date", __rsHead.getString("doc_date"));
                objmain.put("doc_ref", __rsHead.getString("doc_ref"));
                objmain.put("doc_type", __rsHead.getString("doc_type"));
                objmain.put("trans_type", __rsHead.getString("trans_type"));
                objmain.put("creator_code", __rsHead.getString("creator_code"));
                objmain.put("creator_name", __rsHead.getString("creator_name"));
                objmain.put("wh_code", __rsHead.getString("wh_code"));
                objmain.put("wh_name", __rsHead.getString("wh_name"));
                objmain.put("remark", __rsHead.getString("remark"));

            }
            JSONArray jsarrDetail = new JSONArray();
            String query2 = "select * from sc_import_detail_temp where doc_no='" + _doc_no + "'";
            System.out.println("query2 " + query2);
            PreparedStatement __stmt2 = __conn.prepareStatement(query2, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead2 = __stmt2.executeQuery();
            while (__rsHead2.next()) {
                JSONObject obj2 = new JSONObject();

                obj2.put("doc_no", __rsHead2.getString("doc_no"));
                obj2.put("item_code", __rsHead2.getString("item_code"));
                obj2.put("item_name", __rsHead2.getString("item_name"));
                obj2.put("unit_code", __rsHead2.getString("unit_code"));
                obj2.put("doc_date", __rsHead2.getString("doc_date"));
                obj2.put("qty", __rsHead2.getString("qty"));

                jsarrDetail.put(obj2);
            }
            objmain.put("detail", jsarrDetail);

            jsarrDetailx.put(objmain);
            __rsHead.close();

            __stmt.close();

        } catch (SQLException e) {
            __html.append(e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            __html.append(e.getMessage());
            e.printStackTrace();
        } finally {
            if (__conn != null) {
                try {
                    __conn.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }

        response.getWriter().print(jsarrDetailx);
    }

}
