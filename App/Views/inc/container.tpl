<div class="container-fluid">
	<div class="row">
		{% block sidebar %}
			{% include 'inc/sidebar.tpl' %}
		{% endblock %}
		{% block content %}
			{% include 'inc/content.tpl' %}
		{% endblock %}
	</div>
</div>