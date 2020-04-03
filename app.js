const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');

const app = express();


app.use(helmet());
app.use(cors());
app.use(compression()); //Compress all routes


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(process.env.PORT, () => {
    console.log('listening on port: 4000')
});