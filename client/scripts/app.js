(function() {
	var app = angular.module('wall', [
			'wall.routes',
			'wall.jobModule',
			'wall.jobsModule',
			'wall.jobsDetailModule',
			'wall.menuModule',
			'wall.addJobModule',
			'wall.menuSelectModule',
			'wall.notFound',
			'wall.userInfo',
			'wall.partials',

			'wall.loginService'
		]);
	app.run(function(loginService) {
		loginService.init();

		// loginService.getServerState().then(function(state) {
		// 	console.log(state);

		// 	loginService.login('twitter').then(function(data) {
		// 		console.log(data);

		// 		loginService.check().then(function(data) {
		// 			console.log(data);
		// 		})
		// 	})
		// })
	});

	// Setup for partials that are compiled during the build process
	try {
		var partials = angular.module('wall.partials');
	} catch (e) {
		var partials = angular.module('wall.partials', []);
	}
})();