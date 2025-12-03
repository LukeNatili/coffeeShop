const http = require('http');
const fs = require('fs');
const path = require('path');
const { send } = require('process');
const port = 8000;

const DATA_FILE = path.join(__dirname, 'products.json');
const ORDER_FILE = path.join(__dirname, 'orders.json');
const CART_FILE = path.join(__dirname, 'cart.json');

let products = [];
let orders = [];
let cart = [];
const RESOURCE_MAP = {
	'products': {
		data: products,
		file: DATA_FILE
	},
	'orders': {
		data: orders,
		file: ORDER_FILE
	},
	'cart': {
		data: cart,
		file: CART_FILE
	}
	}

// eventually remap these to a database? Or store as a map 

//Function for loading JSON data from file - LP
function loadJSON(filePath) {
	const data = fs.readFileSync(filePath);
	try {
		return JSON.parse(data);
	}
	catch {
		return [];
	}
}

if (fs.existsSync(ORDER_FILE)) {
	orders = loadJSON(ORDER_FILE);
}
if (fs.existsSync(DATA_FILE)) {
	products = loadJSON(DATA_FILE)
}

//Function for saving orders/products to JSON file - LP

function saveJSON() {
	fs.writeFileSync(dataFile, JSON.stringify(dataArray, null, 2));
}

function sendJSON(res, statusCode, data) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.writeHead(statusCode, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(data));
}


//Rewrite of server code to make more portable/reusable - LP
const server = http.createServer((req, res) => {
	const {method, url} = req;

	const urlParts = url.split('/').filter(Boolean); //split url and remove empty string/falsy values.
	const resource = urlParts[1]; //find if we are going into products or orders, or other resource
	const id = urlParts[2]; //find id of resource where applicable

	const mapped = RESOURCE_MAP[resource];
	if (!mapped) {
		return sendJSON(res, 404, {error: `Resource: ${resource} not found`});
	}
	const dataArray = mapped.data;
	const dataFile = mapped.file;
	
	//CORS
	if (method === 'OPTIONS') {	
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	
		res.writeHead(204);
		return res.end();
	}
	//Rewritten - Retrieve resource from server
	if (method ==='GET' && urlParts[0] === 'api') {
		if (!id) {
		return sendJSON (res, 200, dataArray) //All data should have an ID though
		}
		else {
			const item = dataArray.find(p => String(p.id) === String(id)); //check for product with id, and return error if we cannot find an item with that id
			if (!item) {
				return sendJSON(res, 404, {error: `${resource}: ${id} not found`});
			}
			return sendJSON(res, 200, item);
		}
	}

	
	//Rewrite - More generalized POST handler for both products and orders and future resources
	
	if(method === 'POST' && urlParts[0] === 'api') {
		let body = '';
		req.on('data', chunk => (body += chunk));
		req.on('end', () => {
			try {
				const item = JSON.parse(body);
				const exists = dataArray.find( p => p.id === item.id);
				
				if (exists) {
					return sendJSON(res, 400, {error: `${resource} with id ${item.id} already exists`});
				}
				
				resource.push(item);
				saveJSON();
				sendJSON(res, 201, item);
			}
			catch (err) {
				sendJSON(res, 400, {error: 'Invalid JSON'});
			}
		});
		return;
	}
	
	//Deleting products from server
	if(method === 'DELETE' && urlParts[0] === 'api' && id) {
		const index = dataArray.findIndex(p => String(p.id) === String(id)); //If the index exists, it'll store it, otheriwse it's -1
		if (index === -1) { //No product with this id
			return sendJSON(res, 404, {error: `${resource}: ${id} not found`});
		}
		resource.splice(index, 1);
		saveJSON();
		return sendJSON(res, 200, {message: 'Delete Successful'});
	}
	
	//Catchall (hopefully) for other failures
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Not Found');
	
	//End of Server Code - I keep losing these braces
	});
	
	//Server startup
	
	server.listen(port, () => {
		console.log(`Server started succesfully. Running on http://localhost:${port}`);
	});		

	process.on('SIGINT', () => {
		console.log('\nServer shutting down...');
		server.close(() => {
			console.log('Server closed.');
			process.exit(0);
		});
	});
	
		