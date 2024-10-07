const http = require('http');
const data = require('./support')

http.createServer((request, response)=>{
        if(request.method === 'Post' && request.url === '/insert'){
            response.end('data inserted')
        }
        else{
            response.end(JSON.stringify(data))
        }
        
}).listen(4500, ()=>{
    console.log('server is running on port 4500')
})