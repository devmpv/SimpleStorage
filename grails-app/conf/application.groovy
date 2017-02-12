
grails {
	plugin {
		springsecurity {
			authority.className = 'com.devmpv.Role'
			cacheUsers = true
			gsp { layoutAuth = layoutDenied = 'application' }
			logout.postOnly = false
			roleHierarchy = 'ROLE_ADMIN > ROLE_USER'
			userLookup {
				authorityJoinClassName = 'UserRole'
				userDomainClassName = 'com.devmpv.User'
			}

			controllerAnnotations.staticRules = [
				[pattern: '/',               access: 'IS_AUTHENTICATED_REMEMBERED'],
				[pattern: '/error',          access: 'permitAll'],
				[pattern: '/index',          access: 'IS_AUTHENTICATED_REMEMBERED'],
				[pattern: '/index.gsp',      access: 'IS_AUTHENTICATED_REMEMBERED'],
				[pattern: '/shutdown',       access: 'permitAll'],
				[pattern: '/assets/**',      access: 'permitAll'],
				[pattern: '/**/js/**',       access: 'permitAll'],
				[pattern: '/**/css/**',      access: 'permitAll'],
				[pattern: '/**/images/**',   access: 'permitAll'],
				[pattern: '/**/favicon.ico',  access: 'permitAll'],
				[pattern: '/securityinfo',    access: 'ROLE_ADMIN'],
				[pattern: '/securityinfo/**', access: 'ROLE_ADMIN']
			]

			filterChain.chainMap = [
				[pattern: '/assets/**',      filters: 'none'],
				[pattern: '/**/js/**',       filters: 'none'],
				[pattern: '/**/css/**',      filters: 'none'],
				[pattern: '/**/images/**',   filters: 'none'],
				[pattern: '/**/favicon.ico', filters: 'none'],
				[pattern: '/**',             filters: 'JOINED_FILTERS']
			]

			secureChannel.definition = [
				[pattern: '/testsecure/**',   access: 'REQUIRES_SECURE_CHANNEL'],
				[pattern: '/testinsecure/**', access: 'REQUIRES_INSECURE_CHANNEL'],
				[pattern: '/testany/**',      access: 'ANY_CHANNEL']
			]
		}
	}
}


