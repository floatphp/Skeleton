<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="icon" type="image/png" href="{{root}}/public/assets/images/icon.png">
		{% block title %}
			<title>{HookableCMS}</title>
		{% endblock %}
		{% block css %}
			<link rel="stylesheet" type="text/css" href="{{root}}/public/assets/vendor/bootstrap/css/bootstrap.min.css">
			{# e.g. Hookable CSS items #}
			{# 'add-css' is a system hook #}
			{{ doAction('add-css') }}
		{% endblock %}
		{% block maincss %}
			<link rel="stylesheet" type="text/css" href="{{config.root}}/public/assets/css/style.css">
		{% endblock %}
	</head>
	<body>