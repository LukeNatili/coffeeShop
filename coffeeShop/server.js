const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8000;

const DATA_FILE = path.join(__dirname, 'products.json');

let products = [];
if (fs.existsSync(DATA_FILE)) {
	const data = fs.readFileSync(DATA_FILE);
	try {
		products = JSON.parse(data);
	}
	catch {
		products = [];
	}
}

function saveProducts() {
	fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

function sendJSON(res, statusCode, data) {
	res.writeHead(statusCode, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(data));
}


const server = http.createServer((req, res) => {
	const {method, url} = req;
	
	//CORS
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	
	if(method ==='OPTIONS') {
		res.writeHead(204);
		return res.end();
	}
	//Retrieving products from server
	if (method ==='GET' && url === '/api/products') {
		return sendJSON(res, 200, products);
	}
	
	//Saving products to server
	
	if(method === 'POST' && url === '/api/products') {
		let body = '';
		req.on('data', chunk => (body += chunk));
		req.on('end', () => {
			try {
				const product = JSON.parse(body);
				const exists = products.find( p => p.id === product.id);
				
				if (exists) {
					return sendJSON(res, 400, {error: 'There is already a product with this ID' });
				}
				
				products.push(product);
				saveProducts();
				sendJSON(res, 201, product);
			}
			catch (err) {
				sendJSON(res, 400, {error: 'Invalid JSON'});
			}
		});
		return;
	}
	
	//Deleting products from server
	if(method === 'DELETE' && url.startsWith('/api/products/')) {
		const id = url.split('/').pop();
		const index = products.findIndex(p => String(p.id) === String(id)); //If the index exists, it'll store it, otheriwse it's -1
		if (index === -1) { //No product with this id
			return sendJSON(res, 404, {error: 'Product not found'});
		}
		products.splice(index, 1);
		saveProducts();
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
	
		