#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
program
    .option('-r, --routes <path>', 'Path to the JSON file containing the route configurations.')
    .option('-p, --port <port>', 'Port number for the mock server. (Default is 9000)', '9000')
    .parse(process.argv);
/**
 * Load route configurations from a JSON file.
 * @returns {Record<string, RouteDataType>} A record containing route configurations.
 */
const loadRoutes = () => {
    try {
        const content = fs.readFileSync(path.join(process.cwd(), program.opts().routes), 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Error loading configurations:', error.message);
        return {};
    }
};
/**
 * Handle an HTTP request based on the provided route configuration.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {RouteDataType} route - The route configuration.
 */
const handleRequest = (req, res, route) => {
    var _a, _b, _c, _d;
    // Check parameters
    for (const [paramKey, paramValue] of Object.entries((_a = route.params) !== null && _a !== void 0 ? _a : {})) {
        if (req.params[paramKey] !== paramValue) {
            return res.status(400).json({ error: `Incorrect value for parameter ${paramKey}` });
        }
    }
    // Check request body
    if (Object.keys((_b = route.body) !== null && _b !== void 0 ? _b : {}).length > 0 && !isEqual(req.body, (_c = route.body) !== null && _c !== void 0 ? _c : {})) {
        return res.status(400).json({ error: 'Incorrect request body' });
    }
    // Check headers
    for (const [headerKey, headerValue] of Object.entries((_d = route.headers) !== null && _d !== void 0 ? _d : {})) {
        if (req.get(headerKey) !== headerValue) {
            return res.status(400).json({ error: `Incorrect value for header ${headerKey}` });
        }
    }
    // Send the response
    res.json(route.response);
};
/**
 * Configure mock endpoints based on the loaded route configurations.
 */
const configureMockEndpoints = () => {
    const mockConfig = loadRoutes();
    for (const [route, config] of Object.entries(mockConfig)) {
        switch (config.method.toUpperCase()) {
            case 'GET':
                app.get(route, (req, res) => handleRequest(req, res, config));
                break;
            case 'POST':
                app.post(route, (req, res) => handleRequest(req, res, config));
                break;
            case 'PUT':
                app.put(route, (req, res) => handleRequest(req, res, config));
                break;
            case 'PATCH':
                app.patch(route, (req, res) => handleRequest(req, res, config));
                break;
            case 'DELETE':
                app.delete(route, (req, res) => handleRequest(req, res, config));
                break;
            default:
                console.warn(`Unsupported method for route ${route}`);
        }
    }
};
/**
 * Compare two objects for equality.
 * @param {Record<string, string>} obj1 - The first object.
 * @param {Record<string, string>} obj2 - The second object.
 * @returns {boolean} True if the objects are equal, false otherwise.
 */
const isEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
};
// Express app initialization
const port = Number(program.opts().port);
const app = express();
// Middleware setup
app.use(cors());
app.use(express.json());
// Configure mock endpoints
configureMockEndpoints();
// Start the Express app
app.listen(port, () => {
    console.log(`Mock server running at http://localhost:${port}`);
});
