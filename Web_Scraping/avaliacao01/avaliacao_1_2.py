# scrapy runspider avaliacao_1_2.py -o av1_2.json --nolog -a pesquisa=livro-python

import scrapy

class MercadolivreSpider(scrapy.Spider):
    name = 'MercadoLivre'
    proxima_pagina = 1

    def __init__(self, pesquisa=None, *args, **kwargs):
        super(MercadolivreSpider, self).__init__(*args, **kwargs)
        self.start_urls = ['https://lista.mercadolivre.com.br/%s' % pesquisa]

    def parse(self, response):
        
        produtos = response.xpath('.//ol[contains(@class,"section") and contains(@class,"search-results")]/li')

        if self.proxima_pagina == 1:
            print('Página 1')

        for produto in produtos:
            
            descricao = produto.xpath('.//span[contains(@class,"main-title")]/text()').extract_first()

            preco_simbolo = produto.xpath('.//span[@class="price__symbol"]/text()').extract_first()

            preco_fracao = produto.xpath('.//span[@class="price__fraction"]/text()').extract_first()

            preco_decimal = produto.xpath('.//span[@class="price__decimals"]/text()').extract_first()

            if preco_decimal is None:
                preco_decimal = '00'

            preco = str(preco_simbolo) + " " + str(preco_fracao) + "," + str(preco_decimal)

            yield {
                'descricao': descricao,
                'preco': preco
            }

        next_page = response.xpath('.//a[contains(@class,"prefetch")]/@href')

        if next_page:

            self.proxima_pagina += 1
            print('Página %s' % self.proxima_pagina)

            yield scrapy.Request(
                url=next_page.extract_first(),
                callback=self.parse
            )

        else:
            print('Concluído!')