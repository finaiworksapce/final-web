const http = require('http');

const server = http.createServer((clientReq, clientRes) => {
    const options = {
        hostname: '127.0.0.1',
        port: 3016,
        path: clientReq.url,
        method: clientReq.method,
        headers: {
            ...clientReq.headers,
            host: 'localhost:3016'
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
    });

    proxyReq.on('error', (err) => {
        clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
        clientRes.end('Dev server is starting or unavailable on port 3016.');
    });

    clientReq.pipe(proxyReq, { end: true });
});

// Support websockets for HMR (Hot Module Replacement)
server.on('upgrade', (req, socket, head) => {
    const net = require('net');
    const proxySocket = net.connect(3016, '127.0.0.1', () => {
        proxySocket.write(head);
        socket.pipe(proxySocket);
        proxySocket.pipe(socket);
    });
    proxySocket.on('error', () => socket.destroy());
    socket.on('error', () => proxySocket.destroy());
});

server.listen(3000, () => {
    console.log('Proxy active: http://localhost:3000 -> http://localhost:3016');
});
