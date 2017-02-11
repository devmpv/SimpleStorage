package simplestorage

class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?(.$format)?"{ constraints {
				// apply constraints here
			} }

		"/"(view:"/index")
		"500"(view:'/error')
		"404"(view:'/notFound')

		"/api/search"(controller:"search", method:"GET")
	}
}
