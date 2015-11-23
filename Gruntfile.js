var exec_sync = require('sync-exec');
module.exports = function(grunt) {
	grunt.initConfig({
		config : grunt.file.readJSON('app/config.json'),
		ti : {
		},
		copy : {
		},
		shell : {
		},
		clean : {
			res : {
				src : ["Resources", "build", "dist", "tmp"]
			}
		},
		gitcheckout : {
			master : {
				options : {
					branch : "master"
				}
			},
			develop : {
				options : {
					branch : "develop"
				}
			}
		},
		xmlpoke : {
			bundle : {
			},
			urlschema : {
			}
		},
		http : {
        },
		hipchat_notifier:{
			options : {
				authToken : "", // Create an authToken at https://hipchat.com/admin/api
				roomId : "" // Numeric Hipchat roomId or room name
			},
			// Now create as many messages as you like!
			hello_grunt : {
				options : {
					message : "Hello!", // A message to send
					from : "Grunt", // Name for the sender
					color : "purple", // Color of the message
					message_format : "html" // Can either be 'text' or 'html' format
				}
			}
		}
	});
    
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-titanium');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-xmlpoke');
	grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-hipchat-notifier');

	grunt.registerTask('test', []);
};