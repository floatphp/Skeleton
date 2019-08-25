<main role="main">
	{% block main %}
		{% block maintitle %}
			{# e.g. Hookable main title #}
			<div class="title-wrapper">
				<h2>{Title}</h2>
			</div>
		{% endblock %}
		{% block maincontent %}
			{# e.g. Hookable main content #}
			{# Must be inside block to be inherited #}
			{{ doAction('content') }}
		{% endblock %}
	{% endblock %}
</main>