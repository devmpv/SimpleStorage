package simplestorage

import org.grails.plugins.excelimport.*
import org.hibernate.criterion.CriteriaSpecification

import com.devmpv.Item

import pl.touk.excel.export.WebXlsxExporter

class SearchController {
	static responseFormats = ['json']
	def index(params) {
		respond query(params)
	}

	def export(params) {
		def withProperties = [
			'extId',
			'title',
			'count',
			'brand.title',
			'size',
			'price'
		]
		String filename = 'export.xlsx'
		response.contentType = ''
		response.setHeader 'Content-disposition', "attachment; filename=\"$filename\""
		new WebXlsxExporter().with {
			add(query(params).get('result'), withProperties)
			save(response.outputStream)
		}
	}

	def private query(params) {
		String title = params.get('title') ? params.get('title')+'%' : '%'
		String brTitle = params.get('brand') ? params.get('brand')+'%' : '%'
		int lowcount = params.get('count') ? params.get('count') as Integer : Integer.MAX_VALUE
		int max = params.get('max') ? params.get('max') as Integer : 0
		int offset = params.get('offset') ? params.get('offset') as Integer : 0
		def c1 = Item.createCriteria()
		def result = c1 {
			resultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP)
			projections {
				brand {
					property('id',  'br_id')
					property('title', 'br_title')
				}
			}
			property('id', 'id')
			property('title', 'title')
			property('extId', 'extId')
			property('size', 'size')
			property('price', 'price')
			property('count', 'count')
			le ("count", lowcount)
			or {
				ilike("title", title)
				brand { ilike("title", brTitle)	}
			}
			maxResults(max)
			firstResult(offset)
			order("title", "asc")
		}
		def c2 = Item.createCriteria()
		def total = c2.count {
			le ("count", lowcount)
			or {
				ilike("title", title)
				brand { ilike("title", brTitle)	}
			}
		}
		return ['result': result, 'count': total]
	}
}
