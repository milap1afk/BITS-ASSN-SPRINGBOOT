<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Author - Library Management</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e0e0e0;
            padding: 30px;
        }
        .form-card {
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 40px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 1.8rem;
            margin-bottom: 30px;
            text-align: center;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .form-group { margin-bottom: 20px; }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #a78bfa;
            font-size: 0.9rem;
        }
        input[type="text"], input[type="email"] {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            color: #e0e0e0;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
        }
        .error-text {
            color: #ff4757;
            font-size: 0.8rem;
            margin-top: 4px;
        }
        .alert-error {
            padding: 14px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            background: rgba(255,71,87,0.15);
            border: 1px solid rgba(255,71,87,0.4);
            color: #ff4757;
        }
        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
        }
        .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-submit {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #fff;
            box-shadow: 0 4px 12px rgba(102,126,234,0.4);
        }
        .btn-cancel {
            background: rgba(255,255,255,0.08);
            color: #aaa;
            border: 1px solid rgba(255,255,255,0.15);
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="form-card">
        <h1>➕ Add New Author</h1>

        <c:if test="${not empty errorMessage}">
            <div class="alert-error">${errorMessage}</div>
        </c:if>

        <form:form action="${pageContext.request.contextPath}/authors/save" method="post" modelAttribute="author">
            <div class="form-group">
                <label for="name">Full Name</label>
                <form:input path="name" id="name" placeholder="e.g. Jane Austen" />
                <form:errors path="name" cssClass="error-text" />
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <form:input path="email" id="email" type="email" placeholder="e.g. jane@example.com" />
                <form:errors path="email" cssClass="error-text" />
            </div>
            <div class="form-group">
                <label for="nationality">Nationality</label>
                <form:input path="nationality" id="nationality" placeholder="e.g. British" />
                <form:errors path="nationality" cssClass="error-text" />
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-submit">Save Author</button>
                <a href="${pageContext.request.contextPath}/authors" class="btn btn-cancel">Cancel</a>
            </div>
        </form:form>
    </div>
</body>
</html>
