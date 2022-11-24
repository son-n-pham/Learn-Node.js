const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js')

const slugify = require('slugify');


const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((request, response) => {

	const {pathname:pathName, query} = url.parse(request.url, true);

	// Overview page
	if (pathName==='/' || pathName==='/overview') {
		response.writeHead(200, {'Content-type': 'text/html'});
		const cardsHtml = dataObj.map(productCard => replaceTemplate(templateCard, productCard)).join('');
		const overview = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

		response.end(overview);

	// Product page
	} else if (pathName==='/product') {
		response.writeHead(200, {'Content-type': 'text/html'});

		const product = dataObj[query.id];
		const output = replaceTemplate(templateProduct, product);

		response.end(output);

	// API page
	} else if (pathName==='/api') {
		response.writeHead(200, {'Content-type': 'application/json'});
		response.end(data);
	}

})

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to 127.0.0.1:8000');
})