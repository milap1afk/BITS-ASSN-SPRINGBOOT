<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Joined Data - Authors &amp; Books</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;color:#e0e0e0;padding:30px}
        .top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;flex-wrap:wrap;gap:15px}
        h1{font-size:2rem;background:linear-gradient(90deg,#4facfe,#00f2fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .btn{display:inline-block;padding:10px 24px;text-decoration:none;color:#1a1a2e;border-radius:8px;font-size:.95rem;font-weight:600;transition:transform .2s;background:linear-gradient(135deg,#4facfe,#00f2fe)}
        .btn:hover{transform:translateY(-2px)}
        .info{background:rgba(79,172,254,.1);border:1px solid rgba(79,172,254,.3);border-radius:10px;padding:14px 20px;margin-bottom:20px;color:#4facfe;font-size:.9rem}
        .table-container{background:rgba(255,255,255,.05);border-radius:16px;border:1px solid rgba(255,255,255,.1);overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.3)}
        table{width:100%;border-collapse:collapse}
        th{padding:16px 20px;text-align:left;background:rgba(79,172,254,.15);color:#4facfe;font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:1px}
        td{padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.05)}
        tr:hover td{background:rgba(255,255,255,.03)}
        .empty-msg{text-align:center;padding:40px;color:#888}
    </style>
</head>
<body>
<div class="top-bar">
    <h1>🔗 Authors &amp; Books (Inner Join)</h1>
    <a href="${pageContext.request.contextPath}/" class="btn">🏠 Home</a>
</div>
<div class="info">This view uses a custom JPQL inner join query between the <strong>Author</strong> and <strong>Book</strong> tables.</div>
<div class="table-container">
    <c:choose>
        <c:when test="${not empty joinedData}">
            <table>
                <thead><tr><th>Book Title</th><th>ISBN</th><th>Genre</th><th>Price</th><th>Author Name</th><th>Author Email</th><th>Nationality</th></tr></thead>
                <tbody>
                    <c:forEach var="row" items="${joinedData}">
                        <tr>
                            <td>${row[0].title}</td>
                            <td>${row[0].isbn}</td>
                            <td>${row[0].genre}</td>
                            <td>$${row[0].price}</td>
                            <td>${row[1].name}</td>
                            <td>${row[1].email}</td>
                            <td>${row[1].nationality}</td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:when>
        <c:otherwise><div class="empty-msg">No joined data found.</div></c:otherwise>
    </c:choose>
</div>
</body>
</html>
