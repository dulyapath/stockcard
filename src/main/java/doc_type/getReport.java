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

@WebServlet(name = "report_stock", urlPatterns = {"/getReportStock"})
public class getReport extends HttpServlet {

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

        JSONArray jsarr = new JSONArray();

        Connection __conn = null;
        try {
            _routine __routine = new _routine();
            __conn = __routine._connect(__dbname, _global.FILE_CONFIG(__provider));

            String _itemCode = "";
            if (request.getParameter("itemcode") != "") {
                String[] itemSplit = request.getParameter("itemcode").split(",");
                if (itemSplit.length > 1) {
                    String _whereIc = "";
                    for (int i = 0; i < itemSplit.length; i++) {
                        if (i == 0) {
                            _whereIc += "'" + itemSplit[i] + "'";
                        } else {
                            _whereIc += ",'" + itemSplit[i] + "'";
                        }
                    }
                    _itemCode = "  and sc.item_code in (" + _whereIc + ") ";
                } else {
                    _itemCode = "  and sc.item_code='" + request.getParameter("itemcode") + "' ";
                }

            }
            String _whCode = "";
            if (request.getParameter("whcode") != "") {
                _whCode = "  and sc.wh_code='" + request.getParameter("whcode") + "' ";
            }

            String _groupMain = "";
            if (request.getParameter("groupmain") != "") {
                _groupMain = "  and ic.group_main='" + request.getParameter("groupmain") + "' ";
            }
            String _groupSub = "";
            if (request.getParameter("groupsub") != "") {
                _groupSub = "  and ic.group_sub='" + request.getParameter("groupsub") + "' ";
            }
            String _itemBrand = "";
            if (request.getParameter("itembrand") != "") {
                _itemBrand = "  and ic.item_brand='" + request.getParameter("itembrand") + "' ";
            }
            String _itemType = "";
            if (request.getParameter("type") != "") {
                _itemType = "  and ic.item_type='" + request.getParameter("type") + "' ";
            }

            String query1 = "select distinct sc.item_code,ic.name_1 as item_name,sc.wh_code,sc.unit_code,ic.item_brand,ic.group_main,ic.group_sub, "
                    + "coalesce((select barcode from ic_inventory_barcode where ic_code = sc.item_code and unit_code = sc.unit_code),'')as barcode "
                    + "from sc_detail as sc "
                    + "left join ic_inventory as ic on ic.code = sc.item_code "
                    + "where 1=1 " + _itemCode + _whCode + _groupMain + _groupSub + _itemBrand + _itemType + " order by item_code,wh_code ";
            System.out.println("query1 " + query1);
            PreparedStatement __stmt = __conn.prepareStatement(query1, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet __rsHead = __stmt.executeQuery();

            while (__rsHead.next()) {

                JSONObject obj = new JSONObject();
                obj.put("item_code", __rsHead.getString("item_code"));
                obj.put("item_name", __rsHead.getString("item_name"));
                obj.put("barcode", __rsHead.getString("barcode"));
                obj.put("wh_code", __rsHead.getString("wh_code"));
                obj.put("unit_code", __rsHead.getString("unit_code"));

                String queryBalance = "select sum(balance_qty) as balance_qty from sml_ic_function_stock_balance_warehouse_location(current_date,'" + __rsHead.getString("item_code") + "','" + __rsHead.getString("wh_code") + "','')  ";
                System.out.println("queryBalance " + queryBalance);
                PreparedStatement __stmtBalance = __conn.prepareStatement(queryBalance, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsBalance = __stmtBalance.executeQuery();
                String balance_qty = "0";
                while (__rsBalance.next()) {
                    if (__rsBalance.getString("balance_qty") == null) {
                        balance_qty = "0";
                    } else {
                        balance_qty = __rsBalance.getString("balance_qty");
                    }

                }
                obj.put("balance_qty", balance_qty);

                String queryScQty = "select trans_type,qty from sc_detail where item_code = '" + __rsHead.getString("item_code") + "' and wh_code = '" + __rsHead.getString("wh_code") + "' ";
                System.out.println("queryScQty " + queryScQty);
                PreparedStatement __stmtSC = __conn.prepareStatement(queryScQty, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet __rsSC = __stmtSC.executeQuery();
                Double receive = 0.0;
                Double outqty = 0.0;
                Double sc_balance = 0.0;
                while (__rsSC.next()) {
                    if (__rsSC.getString("trans_type").equals("0")) {
                        receive += Double.parseDouble(__rsSC.getString("qty"));
                    } else {
                        outqty += Double.parseDouble(__rsSC.getString("qty"));
                    }
                }
                sc_balance = receive - outqty;
                obj.put("sc_qty", sc_balance);

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
