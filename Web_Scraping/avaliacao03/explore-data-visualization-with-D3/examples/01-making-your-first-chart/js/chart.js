async function drawLineChart() {
    const dataset = await d3.json('./scripts/my_weather_data.json');
    // console.table(dataset[0]);

     // Funções de acesso
    const yAccessor = d => d.temperatureMax;
    const dateParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = d => dateParser(d.date);
    console.log(xAccessor(dataset[0]))

    // Criando as dimensões do nosso gráfico
    // Queremos uma pequena margem no topo e à direita
    // A linha do eixo-y pode passar da fronteira do gráfico, então vamos
    // definir uma margem maior em baixo e à esquerda pra dar mais espaço aos eixos
    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // Desenhando
    const svg = d3.select("#wrapper")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

    // Podemos desenhar o gráfico dentro de um elemento "g" e movê-lo todo de uma vez usando a propriedade de transformação do CSS
    const bounds = svg.append("g")  // Pense no "g" como o equivalente a uma "div" dentro do SVG
        .style("transform", `translate(${dimensions.margin.left}px,
                                       ${dimensions.margin.top}px)`)

    // Criando a escala
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))  // d3.extent retorna um array com a temperatura mínima e máxima
        .range([dimensions.boundedHeight, 0])   // faixa com o menor e maior número de pixels a mostrar

    // Vamos visualizar a média das temperaturas em um retângulo
    const meanTemperaturePlacement = yScale(d3.mean(dataset, yAccessor))
    const meanTemperatures = bounds.append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", meanTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - meanTemperaturePlacement)
        .attr("fill", "#e0f3ff")  // Fazemos um retângulo para mostrar a parte mais fria

    // Usa uma escala de tempo, pois estamos lidando do datas
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))  
        .range([0, dimensions.boundedWidth])
    
      /*
    “O atributo d de um path aceita alguns comandos que podem ser com letra maiúscula (se dado um valo absoluto)
    ou minúscula (se dado um valor relativo):

    M move para um ponto (seguido dos valores x e y)
    L desenha uma linha até um ponto (seguido dos valores x e y)
    Z desenha uma linha para o prrimeiro ponto”

    Excerpt From: Nate Murray. “Fullstack Data Visualization with D3.” Apple Books.

    bounds.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 50 100 L 50 50 L 0 50 Z")
    
    */
   
    // Cria um gerador que converte pontos de dados em uma string para o atributo d do path
    const lineGenerator = d3.line() 
    // Transforma o ponto para o a função de acesso apropriada e a escala para pegar o valor do 
    // espaço em pixels
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

        const line = bounds.append("path")
        // Alimenta a função geradora de linha como o nosso dataset
        .attr("d", lineGenerator(dataset))
        // Elementos SVG por padrão têm o preenchimento preto (fill) e sem traço (stroke);
        // o que resulta em um forma preenchida, a menos que adicionamentos algum estilo
        .attr("fill", "none")
        .attr("stroke", "#af9358")
        .attr("stroke-width", 2)

    const pt_br = await d3.json('../pt-BR.json')
    // ºC

    const decimalFormat = d3.formatDefaultLocale(pt_br).format(".1f")
    const timeFormat = d3.timeFormatDefaultLocale(pt_br).format("%B")

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .tickFormat(decimalFormat)
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .tickFormat(timeFormat)
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
            .style("transform", `translateY(${dimensions.boundedHeight}px)`)

}

drawLineChart();