const { app, port } = require('../app')

app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
})