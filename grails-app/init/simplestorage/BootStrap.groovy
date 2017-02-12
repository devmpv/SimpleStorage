package simplestorage

import com.devmpv.Brand
import com.devmpv.Item
import com.devmpv.Role
import com.devmpv.User
import com.devmpv.UserRole

class BootStrap {

	def init = { servletContext ->
		def admin = new User(username: 'admin', password: 'password').save(failOnError: true)
		def roleAdmin = new Role(authority: 'ROLE_ADMIN').save(failOnError: true)
		UserRole.create admin, roleAdmin

		def roleUser = new Role(authority: 'ROLE_USER').save(failOnError: true)
		def user = new User(username: 'user', password: 'password').save(failOnError: true)
		UserRole.create user, roleUser

		User.withSession {
			it.flush()
			it.clear()
		}

		assert Role.count() == 2
		assert User.count() == 2
		assert UserRole.count() == 2

		if(!Brand.list()) {
			log.info "Creating brands..."
			new Brand(title: "ImportXLS").save()
			def brand1 = new Brand(title: "Chanel").save()
			def brand2 = new Brand(title: "Gucci").save()
			[
				[extId: '111', title: 'Some title1', brand: brand1, size: 50, count: 10, price:22.50],
				[extId: '222', title: 'Some title2', brand: brand1, size: 50, count: 10, price:33.80],
				[extId: '333', title: 'Some title3', brand: brand2, size: 50, count: 10, price:19.99]
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
