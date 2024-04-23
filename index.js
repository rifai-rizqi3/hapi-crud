'use strict';

const Index = require('@hapi/hapi');

// Database configuration
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/CRUD_App', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected....'))
    .catch(err => console.log(err));

const init = async () => {

    const server = Index.server({
        port: 3000,
        host: 'localhost'
    });

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     handler: (request, h) => {
    //         return 'Hello World!';
    //     }
    // });

    // Define Schema
    let employeeSchema = new mongoose.Schema({
        name: String,
        role: String
    });

    // Create Model
    const Employee = mongoose.model('Employes', employeeSchema);

    // Create employee
    server.route({
        method: 'POST',
        path: '/api/employee',
        handler: async (request, h) => {
            let info = request.payload;
            console.log(info);
            let newInfo = new Employee(info);
            await newInfo.save();
            return h.response("Berhasil di tambahkan");
        }
    });

    // Get
    server.route({
        method: 'GET',
        path: '/api/employes',
        handler: async (request, h) => {
            let params = request.query;
            let infos = await Employee.find(params).lean();
            return h.response(infos);
        }
    });

    // Update
    server.route({
        method: 'PUT',
        path: '/api/employee/{id}',
        handler: async (request, h) => {
            let params = request.params.id;
            let info = request.payload;
            let infos = await Employee.findByIdAndUpdate(params, info, { new: true }).lean();
            return h.response(infos);
        }
    });

    // Delete
    server.route({
        method: 'DELETE',
        path: '/api/employee/{id}',
        handler: async (request, h) => {
            let params = request.params.id;
            let infos = await Employee.findByIdAndDelete(params).lean();
            return h.response(infos);
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
