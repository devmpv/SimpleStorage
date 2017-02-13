package com.devmpv

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource

@Resource(uri='/item', formats=['json'])
@Secured('ROLE_ADMIN')
class Item {
	String extId
	String title
	static belongsTo = [brand: Brand]
	int size
	int count
	float price

	static constraints = {
		title blank:false, size: 5..50
		extId unique: true, blank: false
		price validator: { val -> val >= 0 }
		size validator: { val -> val > 0 }
		count validator: { val -> val >= 0 }
	}
	static mapping = { id column: 'item_id' }
}
