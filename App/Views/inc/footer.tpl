<footer class="footer">
	<div class="container-fluid">
		{# e.g. Hookable footer text #}
		<p class="m-0">{HookableCMS} {Copyright 2019} {{ doAction('footer') }}</p>
	</div>
</footer>
{% block scriptconfig %}
	<script type="text/javascript">
		var globalVars = {};
		globalVars = {
			"baseUri":"{{config.baseUri}}",
			"domain":"{{config.domain}}",
			"root":"{{config.root}}",
		};
		{# e.g. Hookable JS vars #}
		{{ doAction('add-script-config') }}
	</script>
{% endblock %}
{% block js %}
	<script src="{{root}}/public/assets/vendor/jquery/jquery.min.js"></script>
	<script src="{{root}}/public/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	{# e.g. Hookable JS items #}
	{# 'add-js' is a system hook #}
	{{ doAction('add-js') }}
{% endblock %}
{% block mainjs %}
	<script defer src="{{config.root}}/public/assets/js/main.js"></script>
{% endblock %}
</body>
</html>