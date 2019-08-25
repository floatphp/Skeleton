<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="icon" type="image/png" href="{{root}}/public/assets/images/icon.png">
		<title>{HookableCMS} Login</title>
		<link rel="stylesheet" type="text/css" href="{{root}}/public/assets/vendor/bootstrap/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="{{config.root}}/public/assets/css/style.css">
	</head>
	<body>
		<div class="container">
			<div class="row justify-content-center mt-5">
				<div class="col-md-8">
					<div class="card-group">
						<div class="card p-4">
							<div class="card-body">
								<h1>Login</h1>
								<small class="text-muted">Access: demo / demo</small>
								<form class="login-form">
									<div class="input-group mb-3">
										<span class="input-group-addon"><i class="icon-user"></i></span>
										<input type="text" name="username" class="form-control" placeholder="Username" required autofocus>
									</div>
									<div class="input-group mb-4">
										<span class="input-group-addon"><i class="icon-lock"></i></span>
										<input type="password" name="password" class="form-control" placeholder="Password">
									</div>
									<div class="row">
										<div class="col-6">
											<button type="submit" class="btn btn-purple px-4">Login</button>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div class="card text-white bg-purple py-5">
							<div class="card-body text-center">
								<div>
									<img src="{{root}}/public/assets/img/hookablecms.png">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript">
			var globalVars = {};
			globalVars = {
				"baseUri":"{{config.baseUri}}",
				"domain":"{{config.domain}}",
				"root":"{{config.root}}",
			};
		</script>
		<script src="{{root}}/public/assets/vendor/jquery/jquery.min.js"></script>
		<script src="{{root}}/public/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
		<script defer src="{{config.root}}/public/assets/js/login.js"></script>
	</body>
</html>