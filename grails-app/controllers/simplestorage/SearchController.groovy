package simplestorage

import org.grails.plugins.excelimport.*

import com.devmpv.Item

class SearchController {
	static responseFormats = ['json']
	def index(params) {
		if (params.containsKey('title')) {
			if (params.containsKey('extId')) {
				return Item.findAllByTitleIlikeOrExtIdIlike(params.get('title')+'%', params.get('extId')+'%', [ sort: 'title', order: 'asc' ])
			}else {
				return Item.findAllByTitleIlike(params.get('title')+'%', [sort: 'title', order: 'asc'])
			}
		}else {
			if (params.containsKey('extId')){
				return Item.findAllByExtIdIlike(params.get('extId')+'%', [sort: 'title', order: 'asc'])
			}
		}
		respond Item.list()
	}
}
