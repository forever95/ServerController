process.on('message', (m) => {
    // todo: all controllers will be changed here
    console.log('CHILD got message:', m);

    // if process need to send a response
    process.send({ err: null, data: 'data' });
});