/*global jQuery, Handlebars */
jQuery(function( $ ) {
	'use strict';

	var Utils = {
		ajax: function(url, success, context){
			$.ajax({
			  type: "POST",
			  url: url,
			  dataType: 'jsonp'
			}).done(function(msg){
				success.call(context, msg);
			});
		}
	};

	var App = {
		init: function(username) {
			this.baseUrl = 'https://api.github.com/users/';
			this.apiUrl = this.buildApiUrl(username);
			this.meUrl = this.buildMeUrl(username);
			this.repos = [];
			this.me = [];
			this.cacheElements();
			this.getRepos();
			this.getMe();
		},
		buildApiUrl: function(u){
			return this.baseUrl + u + '/repos?type=public';
		},
		buildMeUrl: function(u){
			return this.baseUrl + u;
		},
		cacheElements: function() {
			this.$repos = $('#repos');
			this.$me = $('#me');
			this.repoTemplate = Handlebars.compile( $('#repo-template').html() );
			this.meTemplate = Handlebars.compile( $('#me-template').html() );
		},
		getRepos: function(){
			var that = this;
			Utils.ajax(this.apiUrl, this.saveRepos, that);
		},
		saveRepos: function(data){
			var dL = data.data.length;
			var d;
			while(dL--){
				d = data.data[dL];
				this.repos.push({
					name: d.name,
					url: d.html_url,
					watchers: d.watchers,
					description: d.description
				});
			}
			this.renderRepos();
		},
		renderRepos: function(){
			this.$repos.html( this.repoTemplate( this.repos ) );
		},
		saveMe: function(data){
			var d = data.data;
			this.me.push({
				name: d.name,
				avatar_url: d.avatar_url,
				html_url: d.html_url,
				repos: d.public_repos
			});
			this.renderMe();
		},
		renderMe: function(){
			this.$me.html( this.meTemplate( this.me ) );
		},
		getMe: function(){
			var that = this;
			Utils.ajax(this.meUrl, this.saveMe, that);
		}
	};

	App.init('billdonner'); // change this for yours!

});