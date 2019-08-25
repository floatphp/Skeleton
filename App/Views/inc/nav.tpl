{% block nav %}
	<nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark p-0">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">{Brand}</a>
			<div class="collapse navbar-collapse">
				<ul class="navbar-nav ml-auto">
					{% block navitem %}
						<li class="nav-item active">
							<a class="nav-link" href="#">{Dashboard}
								<span class="sr-only">(current)</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#">
								<span>{System Link 1}</span>
							</a>
						</li>
						{# e.g. Hookable nav items #}
						{{ doAction('nav-item') }}
					{% endblock %}
				</ul>
			</div>
		</div>
	</nav>
{% endblock %}