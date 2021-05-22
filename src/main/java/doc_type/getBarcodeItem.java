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

@WebServlet(name = "getBarcode-type", urlPatterns = {"/getBarcode"})
public class getBarcodeItem extends HttpServlet {

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

                String querycount = "select count(*) as count from sc_detail where item_code='" + __rsHead.getString("item_code") + "' and wh_code='" + __whcode + "' ";
                //System.out.println("query1 "+query1);
                PreparedStatement __stmtCount = __conn.prepareStatement(querycount, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsCount = __stmtCount.executeQuery();
                Integer total_item = 0;
                while (__rsCount.next()) {
                    total_item = __rsCount.getInt("count");
                    obj.put("total_item", __rsCount.getString("count"));
                }
                Integer offset = 10;

                offset = (Integer.parseInt(strOffset)) * 10;
                String queryOld = "select trans_type,qty  from sc_detail where item_code='" + __rsHead.getString("item_code") + "' and wh_code='" + __whcode + "' order by create_datetime desc offset  " + offset;
                //System.out.println("query1 "+query1);
                PreparedStatement __stmtOld = __conn.prepareStatement(queryOld, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsOld = __stmtOld.executeQuery();
                Double old_balance = 0.0;
                Double receive = 0.0;
                Double outqty = 0.0;

                while (__rsOld.next()) {
                    if (__rsOld.getString("trans_type").equals("0")) {
                        receive += Double.parseDouble(__rsOld.getString("qty"));
                    } else {
                        outqty += Double.parseDouble(__rsOld.getString("qty"));
                    }
                }
                old_balance = receive - outqty;

                obj.put("old_balance", old_balance);

                String query2 = "select doc_date,create_datetime as doc_time,doc_ref,doc_type,trans_type,qty,creator_code,(select name_1 from erp_user where code = creator_code ) as creator_name,remark from sc_detail where item_code='" + __rsHead.getString("item_code") + "' and wh_code='" + __whcode + "' order by create_datetime desc limit " + offset;
                //System.out.println("query1 "+query1);
                PreparedStatement __stmt2 = __conn.prepareStatement(query2, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsBody = __stmt2.executeQuery();
                JSONArray jsarrx = new JSONArray();
                while (__rsBody.next()) {
                    JSONObject objDetail = new JSONObject();

                    objDetail.put("doc_date", __rsBody.getString("doc_date"));
                    objDetail.put("doc_time", __rsBody.getString("doc_time"));
                    objDetail.put("doc_ref", __rsBody.getString("doc_ref"));
                    objDetail.put("doc_type", __rsBody.getString("doc_type"));
                    objDetail.put("trans_type", __rsBody.getString("trans_type"));
                    objDetail.put("qty", __rsBody.getString("qty"));
                    objDetail.put("creator_code", __rsBody.getString("creator_code"));
                    objDetail.put("creator_name", __rsBody.getString("creator_name"));
                    objDetail.put("remark", __rsBody.getString("remark"));
                    jsarrx.put(objDetail);
                }
                obj.put("detail", jsarrx);
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
