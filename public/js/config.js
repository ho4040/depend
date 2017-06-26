app = angular.module('app', ['ngCytoscape', 'ui.bootstrap', 'cgPrompt', 'firebase']);

app.factory("Auth", function($firebaseAuth) {
    return $firebaseAuth();
 });

