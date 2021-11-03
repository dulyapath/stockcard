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

@WebServlet(name = "getBarcodeDetail-type", urlPatterns = {"/getBarcodeDetail"})
public class getBarcodeDetail extends HttpServlet {

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
        if (request.getParameter("page") != "") {
            strOffset = request.getParameter("page");
        }
        if (request.getParameter("barcode") != "") {
            _where = " and bc.barcode = '" + request.getParameter("barcode") + "'";

        }

        if (request.getParameter("itemcode") != "") {
            _where = " and ic.code = '" + request.getParameter("itemcode") + "'";
        }

        Connection __conn = null;
        try {
            _routine __routine = new _routine();
            __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String __queryExtend = "";
            String _code = "";
            String _name = "";

            String query1 = "select ic.code as item_code,ic.name_1 as item_name,ic.unit_cost as unit_code,(select name_1 from ic_unit where code = unit_cost) as unit_name from ic_inventory_barcode  as bc "
                    + "FULL OUTER JOIN ic_inventory as ic on ic.code = bc.ic_code "
                    + "where  1=1 " + _where;
            //System.out.println("query1 "+query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();

            while (__rsHead.next()) {

                JSONObject obj = new JSONObject();

                obj.put("item_code", __rsHead.getString("item_code"));
                obj.put("item_name", __rsHead.getString("item_name"));
                obj.put("unit_code", __rsHead.getString("unit_code"));
                obj.put("unit_name", __rsHead.getString("unit_name"));

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
