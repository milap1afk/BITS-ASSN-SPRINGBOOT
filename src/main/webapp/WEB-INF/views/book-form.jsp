<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Book</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#e0e0e0;padding:30px}
        .form-card{background:rgba(255,255,255,.05);border-radius:20px;border:1px solid rgba(255,255,255,.1);padding:40px;width:100%;max-width:500px;box-shadow:0 8px 32px rgba(0,0,0,.3)}
        h1{font-size:1.8rem;margin-bottom:30px;text-align:center;background:linear-gradient(90deg,#f093fb,#f5576c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .form-group{margin-bottom:20px}
        label{display:block;margin-bottom:6px;font-weight:600;color:#f093fb;font-size:.9rem}
        input[type="text"],input[type="number"],select{width:100%;padding:12px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:#e0e0e0;font-size:1rem}
        select option{background:#302b63;color:#e0e0e0}
        input:focus,select:focus{outline:none;border-color:#f093fb;box-shadow:0 0 0 3px rgba(240,147,251,.2)}
        .error-text{color:#ff4757;font-size:.8rem;margin-top:4px}
        .alert-error{padding:14px 20px;border-radius:10px;margin-bottom:20px;background:rgba(255,71,87,.15);border:1px solid rgba(255,71,87,.4);color:#ff4757}
        .btn-group{display:flex;gap:12px;margin-top:30px}
        .btn{flex:1;padding:12px;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;text-decoration:none;text-align:center;transition:transform .2s}
        .btn-submit{background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff}
        .btn-cancel{background:rgba(255,255,255,.08);color:#aaa;border:1px solid rgba(255,255,255,.15)}
        .btn:hover{transform:translateY(-2px)}
    </style>
</head>
<body>
<div class="form-card">
    <h1>➕ Add New Book</h1>
    <c:if test="${not empty errorMessage}"><div class="alert-error">${errorMessage}</div></c:if>
    <form:form action="${pageContext.request.contextPath}/books/save" method="post" modelAttribute="book">
        <div class="form-group">
            <label for="title">Title</label>
            <form:input path="title" id="title" placeholder="e.g. The Great Gatsby"/>
            <form:errors path="title" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="isbn">ISBN</label>
            <form:input path="isbn" id="isbn" placeholder="e.g. 978-0743273565"/>
            <form:errors path="isbn" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="genre">Genre</label>
            <form:input path="genre" id="genre" placeholder="e.g. Fiction"/>
            <form:errors path="genre" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="price">Price ($)</label>
            <form:input path="price" id="price" type="number" step="0.01" placeholder="e.g. 9.99"/>
            <form:errors path="price" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="authorId">Author</label>
            <select name="authorId" id="authorId">
                <option value="">-- Select Author --</option>
                <c:forEach var="author" items="${authors}">
                    <option value="${author.id}">${author.name}</option>
                </c:forEach>
            </select>
        </div>
        <div class="btn-group">
            <button type="submit" class="btn btn-submit">Save Book</button>
            <a href="${pageContext.request.contextPath}/books" class="btn btn-cancel">Cancel</a>
        </div>
    </form:form>
</div>
</body>
</html>
