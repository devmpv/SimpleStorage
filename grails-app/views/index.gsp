<!doctype html>
<html>
<head>
    <title>Simple storage</title>
    <asset:stylesheet src="bootstrap.min.css"/>
</head>
<body>
	<div>
		<span>User: ${sec.username()}<span>
		<span><a href="/logout">logout</a>
	</div>
	
    <div id="react"></div>
    <asset:javascript src="bundle.js" ></asset:javascript>
</body>
</html>
