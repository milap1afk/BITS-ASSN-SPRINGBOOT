<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>All Books</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;color:#e0e0e0;padding:30px}
        .top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;flex-wrap:wrap;gap:15px}
        h1{font-size:2rem;background:linear-gradient(90deg,#f093fb,#f5576c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .btn-group{display:flex;gap:10px;flex-wrap:wrap}
        .btn{display:inline-block;padding:10px 24px;text-decoration:none;color:#fff;border-radius:8px;font-size:.95rem;font-weight:600;transition:transform .2s}
        .btn-primary{background:linear-gradient(135deg,#f093fb,#f5576c)}
        .btn-home{background:linear-gradient(135deg,#4facfe,#00f2fe);color:#1a1a2e}
        .btn:hover{transform:translateY(-2px)}
        .alert{padding:14px 20px;border-radius:10px;margin-bottom:20px;font-weight:500}
        .alert-success{background:rgba(46,213,115,.15);border:1px solid rgba(46,213,115,.4);color:#2ed573}
        .alert-error{background:rgba(255,71,87,.15);border:1px solid rgba(255,71,87,.4);color:#ff4757}
        .table-container{background:rgba(255,255,255,.05);border-radius:16px;border:1px solid rgba(255,255,255,.1);overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.3)}
        table{width:100%;border-collapse:collapse}
        th{padding:16px 20px;text-align:left;background:rgba(240,147,251,.15);color:#f093fb;font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:1px}
        td{padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.05)}
        tr:hover td{background:rgba(255,255,255,.03)}
        .action-btn{display:inline-block;padding:6px 16px;text-decoration:none;color:#fff;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:6px;font-size:.85rem;font-weight:600;transition:transform .2s}
        .action-btn:hover{transform:translateY(-1px)}
        .empty-msg{text-align:center;padding:40px;color:#888;font-size:1.1rem}
    </style>
</head>
<body>
<div class="top-bar">
    <h1>📖 All Books</h1>
    <div class="btn-group">
        <a href="${pageContext.request.contextPath}/books/add" class="btn btn-primary">+ Add Book</a>
        <a href="${pageContext.request.contextPath}/" class="btn btn-home">🏠 Home</a>
    </div>
</div>
<c:if test="${not empty successMessage}"><div class="alert alert-success">${successMessage}</div></c:if>
<c:if test="${not empty errorMessage}"><div class="alert alert-error">${errorMessage}</div></c:if>
<div class="table-container">
    <c:choose>
        <c:when test="${not empty books}">
            <table>
                <thead><tr><th>ID</th><th>Title</th><th>ISBN</th><th>Genre</th><th>Price</th><th>Author</th><th>Action</th></tr></thead>
                <tbody>
                    <c:forEach var="book" items="${books}">
                        <tr>
                            <td>${book.id}</td>
                            <td>${book.title}</td>
                            <td>${book.isbn}</td>
                            <td>${book.genre}</td>
                            <td>$${book.price}</td>
                            <td>${book.author.name}</td>
                            <td><a href="${pageContext.request.contextPath}/books/edit/${book.id}" class="action-btn">✏️ Edit</a></td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:when>
        <c:otherwise><div class="empty-msg">No books found. Add one to get started!</div></c:otherwise>
    </c:choose>
</div>
</body>
</html>
