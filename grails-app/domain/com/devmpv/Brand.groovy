package com.devmpv

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource

@Resource(uri='/brand', formats=['json'])
@Secured('IS_AUTHENTICATED_REMEMBERED')
class Brand {
	String title
	static hasMany = [items: Item]
	static mapping = {
		id column: 'id', generator: 'increment'
	}
	static constrains = { title unique: true }
}
