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

@WebServlet(name = "import-doclist", urlPatterns = {"/getDocImport"})
public class getDocImport extends HttpServlet {

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

        String from_date = "";
        if (!request.getParameter("fd").equals("")) {
            from_date = " and doc_date between '" + request.getParameter("fd") + "' and '" + request.getParameter("td") + "' ";
        }
        if (!request.getParameter("search").equals("")) {
            from_date = "";
            search = " and doc_no like '%" + request.getParameter("search").trim() + "%' "
                    + "or remark like '%" + request.getParameter("search").trim() + "%' "
                    + " or creator_code  like '%" + request.getParameter("search").trim() + "%'  ";
        }
        JSONArray jsarr = new JSONArray();

        Connection __conn = null;
        try {
            _routine __routine = new _routine();
            __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String __queryExtend = "";
            String _code = "";
            String _name = "";

            String query1 = "select *,to_char(doc_date,'DD/MM/YYYY') as doc_datex,COALESCE((select name_1 from ic_warehouse where ic_warehouse.code = wh_code),'')as wh_name,COALESCE((select name_1 from erp_user where erp_user.code = creator_code),'')as creator_name from sc_import_temp where 1=1 " + from_date + search + " order by create_datetime desc limit 50 ";
            System.out.println("query1 " + query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();

            ResultSetMetaData _rsHeadMd = __rsHead.getMetaData();
            int _colHeadCount = _rsHeadMd.getColumnCount();

            int row = __rsHead.getRow();

            while (__rsHead.next()) {

                JSONObject obj = new JSONObject();

                obj.put("doc_no", __rsHead.getString("doc_no"));
                obj.put("doc_date", __rsHead.getString("doc_date"));
                obj.put("doc_datex", __rsHead.getString("doc_datex"));
                obj.put("doc_ref", __rsHead.getString("doc_ref"));
                obj.put("doc_type", __rsHead.getString("doc_type"));
                obj.put("trans_type", __rsHead.getString("trans_type"));
                obj.put("creator_code", __rsHead.getString("creator_code"));
                obj.put("creator_name", __rsHead.getString("creator_name"));
                obj.put("wh_code", __rsHead.getString("wh_code"));
                obj.put("wh_name", __rsHead.getString("wh_name"));
                obj.put("remark", __rsHead.getString("remark"));
          
                jsarr.put(obj);
            }

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

        response.getWriter().print(jsarr);
    }

}
