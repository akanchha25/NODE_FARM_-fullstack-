// SERVER

//creating server

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g , product.productName);
    output = output.replace(/{%IMAGE%}/g , product.image);
    output = output.replace(/{%PRICE%}/g , product.price);
    output = output.replace(/{%FROM%}/g , product.from);
    output = output.replace(/{%NUTRIENTS%}/g , product.nutients);
    output = output.replace(/{%QUANTITY%}/g , product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g , product.description);
    output = output.replace(/{%ID%}/g , product.id);


    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic');
    }
    //console.log(output);//to watch what is output

    return output;
    

}
const fs = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html` , 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json` , 'utf-8');
    const dataObj = JSON.parse(data);
    

const server = http.createServer((req,res)=>{

    
    const {query , pathname} = (url.parse(req.url,true));
    
// Overview page
    if(pathname === '/' || pathname === '/overview'){
    
        res.writeHead(200,{'Content-type' : 'text/html'});

       const cardsHtml = dataObj.map(el =>  replaceTemplate(tempCard,el)).join('');
       const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml);
        res.end(output);
    }
// PRODUCT Page    
    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type' : 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

 //API creation

    else if(pathname === '/api'){

        res.writeHead(200,{'Content-type' : 'application/json'});
        
        res.end(data);
    }

        
 // Not Found   
    else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found! :(</h1>');
    }
    
    
});

//listening to incoming request 
server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to the request on port 8000');

});