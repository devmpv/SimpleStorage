package com.devmpv

import grails.rest.Resource

@Resource(uri='/api/items', formats=['json'])
class Item {
	String extId
	String title
	static belongsTo = [brand: Brand]
	int size
	int count
	static constraints = { title blank:false }
}