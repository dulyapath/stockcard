<%
    if (session.getAttribute("user") == null) {
        String site = new String("../login.jsp");
        response.setStatus(response.SC_MOVED_TEMPORARILY);
        response.sendRedirect(site);
        return;
    } else {

        if ((session.getAttribute("wh_code") == null || session.getAttribute("wh_code").toString().trim() == "") || (session.getAttribute("shelf_code") == null || session.getAttribute("shelf_code").toString().trim() == "")) {
            String site = new String("../logout.jsp");
            response.setStatus(response.SC_MOVED_TEMPORARILY);
            response.sendRedirect(site);
            return;
        }

    }

%>