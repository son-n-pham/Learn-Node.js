// // fs is the file system module. We use require('fs') to assess to that module.
// const fs = require('fs');

// // ////////////////////////////////////////////////////////////
// // Blocking, synchronous way
// // https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#fsreadfilesyncpath-options
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreate on ${Date.now()}`;
// const outputFilePath = './txt/output.txt';
// fs.writeFileSync(outputFilePath, textOut);
// console.log(`File is written to ${outputFilePath}`);

// // ////////////////////////////////////////////////////////////
// // Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
// 	if (err) return console.log('ERROR!!!');
// 	fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);

// 			fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
// 				console.log('Your file has been written 😁');
// 			})
// 		})
// 	})
// })
// console.log('Read this first before show the data due to asynchronous fs.readFile');


// // //////////////////////////////////////////////
// // Build a server
// const http = require('http');
// const url = require('url');

// const server = http.createServer((request, response) => {
// 	// console.log(request); //This is to see all contents of the request
// 	console.log(request.url);

// 	const pathName = request.url;

// 	if(pathName==='/' || pathName==='/overview') {
// 		response.end('This is the OVERVIEW');
// 	} else if(pathName==='/product') {
// 		response.end('This is the PRODUCT');
// 	} else {
// 		response.writeHead(404, {
// 			'Content-type': 'text/html',
// 			'my-own-header': 'hello-world'
// 		});
// 		response.end('<h1>Page not found!</h1>')
// 	}

// 	// response.end('Hello from the server!');
// });

// // This ip address is the standard for localhost
// server.listen(8000, '127.0.0.1', () => {
// 	console.log('Listening to requests on port 8000');
// })


// /////////////////////////////////////////////////////
// Build a Simple API
const fs = require('fs');
const http = require('http');
const url = require('url');


// ///////////////
// // This is inefficient version as readfile has to be run each time the user send the request
// const server = http.createServer((request, response) => {
// 	// console.log(request); //This is to see all contents of the request
// 	console.log(request.url);

// 	const pathName = request.url;

// 	if(pathName==='/' || pathName==='/overview') {
// 		response.end('This is the OVERVIEW');
// 	} else if(pathName==='/product') {
// 		response.end('This is the PRODUCT');
// 	} else if(pathName==='/api') {
// 		// fs.readFile('./dev-data/data.json', 'utf-8', (err, data) => {
// 		fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
// 			const productData = JSON.parse(data);
// 			response.writeHead(200, {'content-type': 'application/json'})
// 			response.end(data)
// 		})
// 	}	else {
// 		response.writeHead(404, {
// 			'Content-type': 'text/html',
// 			'my-own-header': 'hello-world'
// 		});
// 		response.end('<h1>Page not found!</h1>')
// 	}

// 	// response.end('Hello from the server!');
// });


// ///////////////
// This is the efficient version as readfile is run once from beginning to load the file. As it is run only once, we can use readFileSync as the blocking is not a long time.

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%ID%}/g, product.id);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);

	if(!product.organic) output = output.replace(/{%NOTORGANIC%}/g, 'not-organic');

	return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer((request, response) => {

	// console.log("Hello");
	// console.log(request.url);
	const {query, pathname} = url.parse(request.url, true);
	console.log(query);
	console.log(pathname);
	const pathName = pathname;

	// Overview page
	if(pathName==='/' || pathName==='/overview') {
		response.writeHead(200, {'content-type': 'text/html'});

		const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

		response.end(output);

	// Product page
	} else if(pathName==='/product') {
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);

		response.end(output);

	// API
	} else if(pathName==='/api') {
			response.writeHead(200, {'content-type': 'application/json'});
			response.end(data);

	// Not found
	}	else {
		response.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-world'
		});
		response.end('<h1>Page not found!</h1>')
	}
});


// This ip address is the standard for localhost
server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
})