(function(window, angular, undefined) {
	var app = angular.module('wall', [
			'wall.routes',

			'wall.controllers',

			'wall.jobModule',
			'wall.jobsModule',
			'wall.jobsDetailModule',
			'wall.menuModule',
			'wall.menuSelectModule',
			'wall.notFound',
			'wall.userInfo',
			'wall.faq',
			'wall.login',
			'wall.partials',

			'wall.requireLogin',

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
})(window, window.angular);