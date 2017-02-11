package com.devmpv

import grails.rest.Resource

@Resource(uri='/api/brands', formats=['json'])
class Brand {
	String title
	static hasMany = [items: Item]
	static mapping = {
		id column: 'id', generator: 'increment'
	}
	static constrains = { title unique: true }
}
