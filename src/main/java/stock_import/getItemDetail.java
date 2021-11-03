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

@WebServlet(name = "getItemDetail-type", urlPatterns = {"/getItemDetail"})
public class getItemDetail extends HttpServlet {

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
        String __whcode = _sess.getAttribute("wh_code").toString().toUpperCase();
        String __dbname = _sess.getAttribute("dbname").toString().toLowerCase();
        String __provider = _sess.getAttribute("provider").toString().toLowerCase();
        String search = "";

        JSONArray jsarr = new JSONArray();

        String _where = "";
        String strOffset = "";
       
        if (request.getParameter("itemcode") != "") {
            _where = " and code = '" + request.getParameter("itemcode") + "'";
        }

        Connection __conn = null;
        try {
            _routine __routine = new _routine();
            __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String __queryExtend = "";
            String _code = "";
            String _name = "";

            String query1 = "select code,name_1 from ic_inventory where  1=1 " + _where;
            //System.out.println("query1 "+query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();

            while (__rsHead.next()) {

                JSONObject obj = new JSONObject();

                obj.put("item_code", __rsHead.getString("code"));
                obj.put("item_name", __rsHead.getString("name_1"));


                String query2 = "select code,(select name_1 from ic_unit where code = ic_unit_use.code)as unit_name from ic_unit_use where ic_code = '"+__rsHead.getString("code")+"' ";
                //System.out.println("query1 "+query1);
                PreparedStatement __stmt2 = __conn.prepareStatement(query2, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsBody = __stmt2.executeQuery();
                JSONArray jsarrx = new JSONArray();
                while (__rsBody.next()) {
                    JSONObject objDetail = new JSONObject();

                    objDetail.put("unit_code", __rsBody.getString("code"));
                    objDetail.put("unit_name", __rsBody.getString("unit_name"));
    
                    jsarrx.put(objDetail);
                }
                obj.put("units", jsarrx);
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
