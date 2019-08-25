{% extends 'inc/content.tpl' %}
{% block maintitle %}
	{# e.g. Extending Hookable main title #}
	<div class="title-wrapper">
		<h2>{Dashboard}</h2>
	</div>
{% endblock %}
{% block maincontent %}
	{# e.g. Extending Hookable main content #}
	<div class="card widget">
		<div class="card-body">
			<h5 class="card-title">{System Widget}</h5>
			<p class="card-text">{Lorem ipsum}</p>
		</div>
	</div>
	{# e.g. Showing parent content #}
	{{parent()}}
{% endblock %}