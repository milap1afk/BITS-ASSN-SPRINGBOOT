<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Update Author</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#e0e0e0;padding:30px}
        .form-card{background:rgba(255,255,255,.05);border-radius:20px;border:1px solid rgba(255,255,255,.1);padding:40px;width:100%;max-width:500px;box-shadow:0 8px 32px rgba(0,0,0,.3)}
        h1{font-size:1.8rem;margin-bottom:30px;text-align:center;background:linear-gradient(90deg,#f093fb,#f5576c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .form-group{margin-bottom:20px}
        label{display:block;margin-bottom:6px;font-weight:600;color:#f093fb;font-size:.9rem}
        input[type="text"],input[type="email"]{width:100%;padding:12px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:#e0e0e0;font-size:1rem}
        input:focus{outline:none;border-color:#f093fb;box-shadow:0 0 0 3px rgba(240,147,251,.2)}
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
    <h1>✏️ Update Author</h1>
    <c:if test="${not empty errorMessage}"><div class="alert-error">${errorMessage}</div></c:if>
    <form:form action="${pageContext.request.contextPath}/authors/update/${author.id}" method="post" modelAttribute="author">
        <div class="form-group">
            <label for="name">Full Name</label>
            <form:input path="name" id="name"/>
            <form:errors path="name" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="email">Email Address</label>
            <form:input path="email" id="email" type="email"/>
            <form:errors path="email" cssClass="error-text"/>
        </div>
        <div class="form-group">
            <label for="nationality">Nationality</label>
            <form:input path="nationality" id="nationality"/>
            <form:errors path="nationality" cssClass="error-text"/>
        </div>
        <div class="btn-group">
            <button type="submit" class="btn btn-submit">Update Author</button>
            <a href="${pageContext.request.contextPath}/authors" class="btn btn-cancel">Cancel</a>
        </div>
    </form:form>
</div>
</body>
</html>
