const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname,'public');

//create file
// fs.writeFileSync(`${filepath}/index.txt`, 'hello everyone')

// fs.writeFileSync(`${filepath}/index.html`, '<h1> hello devendra</h2>')

// read file
// fs.readFile(`${filepath}/index.html`, 'utf-8' , (error , content)=>{
//     if(error) return console.log(error);

//     console.log(content);
// })


// update
// fs.appendFile(`${filepath}/index.html`, 'hello king' , (error , success)=>{
//     if(error) return console.log(error);

//     console.log('file updated')
// })

// file delte
fs.unlinkSync(`${filepath}/index.txt`)