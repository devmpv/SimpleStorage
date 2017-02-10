package simplestorage

import com.devmpv.Brand
import com.devmpv.Item

class BootStrap {

	def init = { servletContext ->
		if(!Brand.list()) {
			log.info "Creating brands..."
			def brand1 = new Brand(title: "Chanel").save()
			def brand2 = new Brand(title: "Gucci").save()
			[
				[extId: '111', title: 'Some title1', brand: brand1, size: 50, count: 10],
				[extId: '222', title: 'Some title2', brand: brand1, size: 50, count: 10],
				[extId: '333', title: 'Some title3', brand: brand2, size: 50, count: 10]
			].each { props ->
				def item = new Item()
				item.properties = props
				item.save(flush: true)
			}
		}
	}
	def destroy = {
	}
}
