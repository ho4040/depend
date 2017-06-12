app = angular.module('app', ['ngCytoscape', 'ui.bootstrap', 'firebase']);

app.factory("Auth", function($firebaseAuth) {
    return $firebaseAuth();
 });

