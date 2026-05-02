<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management System</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #e0e0e0;
        }
        .container {
            text-align: center;
            padding: 60px 40px;
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 700px;
            width: 90%;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #aaa;
            margin-bottom: 40px;
        }
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        .nav-links a {
            display: inline-block;
            padding: 16px 32px;
            text-decoration: none;
            color: #fff;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(102,126,234,0.4);
            min-width: 200px;
        }
        .nav-links a:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(102,126,234,0.6);
        }
        .nav-links a.secondary {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            box-shadow: 0 4px 15px rgba(245,87,108,0.4);
        }
        .nav-links a.secondary:hover {
            box-shadow: 0 6px 20px rgba(245,87,108,0.6);
        }
        .nav-links a.accent {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            box-shadow: 0 4px 15px rgba(79,172,254,0.4);
            color: #1a1a2e;
        }
        .nav-links a.accent:hover {
            box-shadow: 0 6px 20px rgba(79,172,254,0.6);
        }
        .emoji { font-size: 1.4rem; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Library Management</h1>
        <p class="subtitle">Manage your Authors and Books collection</p>
        <div class="nav-links">
            <a href="${pageContext.request.contextPath}/authors"><span class="emoji">✍️</span>View Authors</a>
            <a href="${pageContext.request.contextPath}/books" class="secondary"><span class="emoji">📖</span>View Books</a>
            <a href="${pageContext.request.contextPath}/authors/add"><span class="emoji">➕</span>Add Author</a>
            <a href="${pageContext.request.contextPath}/books/add" class="secondary"><span class="emoji">➕</span>Add Book</a>
            <a href="${pageContext.request.contextPath}/books/joined" class="accent"><span class="emoji">🔗</span>Joined Data</a>
        </div>
    </div>
</body>
</html>
