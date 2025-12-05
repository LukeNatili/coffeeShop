const http = require('http');
const fs = require('fs');
const path = require('path');
const { send } = require('process');
const port = 8000;
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017'; //seems to be default for local MongoDB installations
const dbName = 'coffeShopDB';
let db;

function generateSessionID() {
	return crypto.randomBytes(16).toString('hex');
}

async function connectDB() {
	try {
		const client = new MongoClient(uri);
		await client.connect();
		console.log('Successfully connected to MongoDB');
		db = client.db(dbName);
	}
	catch (err) {
		console.error("Failed to connect  to Database", err);
		process.exit(1);
	}
}


// const DATA_FILE = path.join(__dirname, 'products.json');
// const ORDER_FILE = path.join(__dirname, 'orders.json');
// const CART_FILE = path.join(__dirname, 'cart.json');

//let products = [];
//let orders = [];
//let cart = [];
// const RESOURCE_MAP = {
// 	'products': {
// 		data: products,
// 		file: DATA_FILE
// 	},
// 	'orders': {
// 		data: orders,
// 		file: ORDER_FILE
// 	},
// 	'cart': {
// 		data: cart,
// 		file: CART_FILE
// 	}
// 	}

// eventually remap these to a database? Or store as a map 

//Function for loading JSON data from file - LP
// function loadJSON(filePath) {
// 	const data = fs.readFileSync(filePath);
// 	try {
// 		return JSON.parse(data);
// 	}
// 	catch {
// 		return [];
// 	}
// }

// if (fs.existsSync(ORDER_FILE)) {
// 	orders = loadJSON(ORDER_FILE);
// }
// if (fs.existsSync(DATA_FILE)) {
// 	products = loadJSON(DATA_FILE)
// }

// //Function for saving orders/products to JSON file - LP

// function saveJSON() {
// 	fs.writeFileSync(dataFile, JSON.stringify(dataArray, null, 2));
// }

function sendJSON(res, statusCode, data) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.writeHead(statusCode, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(data));
}


//No longer need local JSON store, code above commented out but kept for reference - LP
const RESOURCE_MAP = {
	'products': {
		collection: 'products'
	},
	'orders': {
		collection: 'orders'
	},
	'cart': {
		collection: 'cart'
	}
};

//Rewrite of server code to make more portable/reusable - LP
const server = http.createServer(async (req, res) => {
	const {method, url} = req;

	if (method === 'OPTIONS') {	
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	
		res.writeHead(204);
		return res.end();
	}
	const urlParts = url.split('/').filter(Boolean); //split url and remove empty string/falsy values.
	const resource = urlParts[1]; //find if we are going into products or orders, or other resource
	const id = urlParts[2]; //find id of resource where applicable

	const mapped = RESOURCE_MAP[resource];
	if (!mapped) {
		return sendJSON(res, 404, {error: `Resource: ${resource} not found`});
	}
	const collection = db.collection(mapped.collection); 
	//Using database now, so no need for local data files/arrays - LP
	// const dataArray = mapped.data;
	// const dataFile = mapped.file;
	
	//CORS
	//Rewritten - Retrieve resource from server
	if (method ==='GET' && urlParts[0] === 'api') {
		try{
			if (!id) {
			const items = await collection.find({}).toArray();
				return sendJSON(res, 200, items); //All data should have an ID though
			}
			else {
				const { ObjectID } = require('mongodb');
				let item;
				try {
					item  = await collection.findOne({_id:  new ObjectID(id)});
				}
				catch (err) {
					return sendJSON(res, 400, {error: `${resource}: ${id} was not found (invalid id)`});
				}
				if (!item) {
					return sendJSON(res, 404, {error: `${resource}: ${id} not found`});
				}
				return sendJSON(res, 200, item);
			}
		}
		catch (err) {
			console.error('Error retrieving data from database', err);
			return sendJSON(res, 500, {error: 'Internal Server Error: YOU BROKE IT!'});
		}
	}

	
	//Rewrite - More generalized POST handler for both products and orders and future resources
	
	if(method === 'POST' && urlParts[0] === 'api') {
		let body = '';
		req.on('data', chunk => (body += chunk));
		req.on('end', async () => {
			try {
				const item = JSON.parse(body);
				//const exists = dataArray.find( p => p.id === item.id);
				
				const result = await collection.insertOne(item);
				
				sendJSON(res, 201, item);
			}
			catch (err) {
				console.error('Error processing POST request', err);
				sendJSON(res, 400, {error: 'Invalid JSON or database insertion error'});
			}
		});
		return;
	}
	
	//Deleting products from server
	if(method === 'DELETE' && urlParts[0] === 'api' && id) {
		try {
			const { ObjectID } = require('mongodb');
			const result = await collection.deleteOne({_id: new ObjectID(id)});
			if (result.deletedCount === 0) {
				return sendJSON(res, 404, {error: `${resource}: ${id} not found`});
			}
			return sendJSON(res, 200, {message: `${resource}: ${id} deleted successfully`});
		}
		catch (err) {
			console.error(err);
			return  sendJSON(res, 500, {error: 'Database deletion error'});
		}
	}
	
	//Catchall (hopefully) for other failures
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Not Found');
	
	//End of Server Code - I keep losing these braces
	});
	
	//Server startup
async function startServer() {
	await connectDB();	
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
}

startServer();
		
