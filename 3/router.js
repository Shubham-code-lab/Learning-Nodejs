const fs = require('fs');


function requestListener(request, response){
    console.log(request.url,request.method, request.headers);
    const url = request.url;
    const method = request.method;

    if(request.url === '/'){
        response.setHeader('Content-Type', 'text/html');
        response.write('<html>');
        response.write('<head><title>My secon page</title></head>');
        //action get url which request which is generated is sent to
        //method
        response.write(`<body>
                            <form action="/message" method="POST">
                                <input name="firstMessage" type="text">
                                <input name="secondMessage" type="text">
                                <button type="submit">Submit</button>
                            </form>
                        </body>`);
        response.write('</html>');
        return response.end(); //we have to terminate the function as node send response to client and hence no more response can't be written   
    }

    if(url === '/message' && method === 'POST'){        //when /message url is requsted and method no form tag is POST
        const body = [];
        request.on('data', function(chunk){
            console.log("this is chunk", chunk);        //<buffre 66 67 45 34>
            body.push(chunk);                           //[<buffer 66 67 45 34>]    
        });
        return request.on('end', function(){            //as call back function are ecrcuted in later hence code on 43 don't execute first hence it don't redirect and code line 52 execute which we don't want 
            console.log("this is body", body);          //[<buffer 66 67 45 34>]
            const parsedBody = Buffer.concat(body).toString();
            console.log("this is parsedbody", parsedBody);   //firstMessage=Shubham&secondMessage=Shinde
            let data = '';
            const message = parsedBody.split('&').forEach(element => {
                data += ' ' + element.split('=')[1];          //Shubham Shinde
            });
            // fs.writeFileSync('message.txt', data);     //block next code untill file is created
            fs.writeFile('message.txt', data, function(err){  //callback execut when file is created callback receive err which contain error when error in creation of file
                response.statusCode = 302;
                response.setHeader('Location', '/');
                console.log('Inside writeFile()');         //exectue when file is created
                return response.end();                     //understand return on line number 32
            });
            console.log("Outside writeFile()");            //don't wat for file creation
        });
    }

    //default header which browser understand 
    //attach header to response where we set meta data
    //key value pair
    response.setHeader('Content-Type', 'text/html');
    response.write('<html>');
    response.write('<head><title>My first page</title></head>');
    response.write('<body><h1>Hello from my Node.js server</h1></body>');
    response.write('</html>');
    response.end();            //after end() we can't write() 

    //stop server which is reunning in browser port 3000
    // process.exit();
}




//variable name is function in app.js i.e :- routes()
// module.exports = requestListener;


// module.exports = {
//     handler: requestListener,
//     someText: 'Hello from router',
// };

// module.exports.handler = requestListener;
// module.exports.someText = 'Hello from router';

 
exports.handler = requestListener;
exports.someText = 'Hello from router';
