package simplestorage

import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.grails.plugins.excelimport.*

import com.devmpv.Brand
import com.devmpv.Item

import grails.transaction.Transactional

class UploadController {
	def excelImportService
	@Transactional
	def save() {
		def file = request.getFile('attach')
		Map CONFIG_BOOK_COLUMN_MAP = [
			sheet:'Sheet1',
			startRow: 0,
			columnMap:  [
				'A':'extId',
				'B':'title',
				'C':'count',
			]
		]
		Workbook workbook = WorkbookFactory.create(file.inputStream)
		def itemList = excelImportService.columns(workbook, CONFIG_BOOK_COLUMN_MAP)
		def brand = Brand.findByTitle('ImportXLS')
		itemList.each { Map map ->
			def item = new Item(extId: map.get('extId'), title: map.get('title'), brand: brand, size: 50, count: map.get('count'))
			item.save(flush: true)
		}
	}
}
