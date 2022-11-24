// /////////////////////////////////
// Module replaceTemplate to use in several files
module.exports = (template, product) => {
	let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%ID%}/g, product.id);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = !product.organic ? output.replace(/{%NOT_ORGANIC%}/g,
	'not-organic') : output.replace(/{%NOT_ORGANIC%}/g,
	'');
	return output;
}