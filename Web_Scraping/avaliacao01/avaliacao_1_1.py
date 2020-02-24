# scrapy runspider avaliacao_1_1.py -o av1_1.json --nolog

import scrapy

class UolSpider(scrapy.Spider):
    name = 'Uol'

    def __init__(self, *args, **kwargs):
        super(UolSpider, self).__init__(*args, **kwargs)
        self.start_urls = ['https://www.uol.com.br/']

    def parse(self, response):
        
        dolar = response.xpath('//*[@id="HU_header"]/div[2]/div/div[2]/div[2]/ul/li[1]/a/span[2]/text()').extract_first()

        print("Cotação do dolar: %s" % dolar)

        yield {
            'Cotação do dolar': dolar
        }
