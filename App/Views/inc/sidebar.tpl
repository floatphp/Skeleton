{% block sidebar %}
	<nav class="col-md-2 d-none d-md-block bg-light sidebar">
		<div class="sidebar-sticky">
			<ul class="nav flex-column">
				<li class="nav-item">
					<a class="nav-link active" href="#">
						{Dashboard} <span class="sr-only">(current)</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">
						{System Menu 1}
					</a>
				</li>
				{# Hookable sidebar items #}
				{{ doAction('sidebar-item') }}
			</ul>
		</div>
	</nav>
{% endblock %}