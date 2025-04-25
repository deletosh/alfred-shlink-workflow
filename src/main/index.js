import { AlfredScriptFilter, AlfredListItem } from 'fast-alfred';
import { request as httpsRequest } from 'https';
import { request as httpRequest } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

// Configuration file path
const configPath = join(homedir(), '.config', 'alfred-shlink-workflow.json');

// Ensure the config directory exists
const configDir = dirname(configPath);
if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
}

// Default configuration
const defaultConfig = {
    server: 'https://your-shlink-server.com', apiKey: 'your-api-key'
};

// Load or create configuration
function loadConfig() {
    try {
        if (existsSync(configPath)) {
            const configData = readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } else {
            writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
    } catch (error) {
        console.error(`Error loading configuration: ${error.message}`);
        return defaultConfig;
    }
}

// Save configuration
function saveConfig(config) {
    try {
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving configuration: ${error.message}`);
        return false;
    }
}

// Extract base URL and path from server URL
function parseServerUrl(serverUrl) {
    const url = new URL(serverUrl);
    return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? '443' : '80'),
        path: url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`
    };
}

// Make HTTP request to Shlink API
function makeRequest(method, endpoint, data, apiKey) {
    return new Promise((resolve, reject) => {
        const config = loadConfig();
        const serverInfo = parseServerUrl(config.server);

        const options = {
            hostname: serverInfo.hostname,
            port: serverInfo.port,
            path: `${serverInfo.path}rest/v2/${endpoint}`,
            method: method,
            headers: {
                'Content-Type': 'application/json', 'X-Api-Key': apiKey || config.apiKey
            }
        };

        // Add Content-Length header if data is provided
        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        }

        const requestFn = serverInfo.protocol === 'https:' ? httpsRequest : httpRequest;

        const req = requestFn(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(responseData));
                    } catch (error) {
                        resolve(responseData);
                    }
                } else {
                    let errorMessage;

                    try {
                        const errorData = JSON.parse(responseData);
                        errorMessage = errorData.detail || errorData.title || 'API request failed';
                    } catch (e) {
                        errorMessage = `API request failed with status ${res.statusCode}`;
                    }

                    reject(new Error(errorMessage));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request error: ${error.message}`));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Create a short URL using Shlink API
async function createShortUrl(longUrl, customSlug = null) {
    const data = {
        longUrl: longUrl,
    };

    if (customSlug) {
        data.customSlug = customSlug;
    }

    try {
        const response = await makeRequest('POST', 'short-urls', data);
        return response;
    } catch (error) {
        throw error;
    }
}

// Process Alfred input and generate appropriate output
async function processAlfredInput(input) {
    const args = input.trim().split(' ');
    const scriptFilter = new AlfredScriptFilter();

    // Handle configuration commands
    if (args[0] === 'config') {
        const config = loadConfig();

        if (args[1] === 'set') {
            if (args[2] === 'server' && args[3]) {
                config.server = args[3];
                saveConfig(config);

                const item = new AlfredListItem()
                    .title('Server URL updated')
                    .subtitle(`Server URL set to ${args[3]}`)
                    .arg(`Server URL set to ${args[3]}`)
                    .variable('message', `Server URL set to ${args[3]}`);

                scriptFilter.addItem(item);
                return scriptFilter;
            } else if (args[2] === 'apikey' && args[3]) {
                config.apiKey = args[3];
                saveConfig(config);

                const item = new AlfredListItem()
                    .title('API key updated')
                    .subtitle('API key has been updated')
                    .arg('API key updated')
                    .variable('message', 'API key updated');

                scriptFilter.addItem(item);
                return scriptFilter;
            }
        } else if (args[1] === 'get') {
            const configInfo = `Server: ${config.server}\nAPI Key: ${config.apiKey.substring(0, 5)}...${config.apiKey.substring(config.apiKey.length - 5)}`;

            const item = new AlfredListItem()
                .title('Current configuration')
                .subtitle(configInfo)
                .arg(configInfo)
                .variable('message', configInfo);

            scriptFilter.addItem(item);
            return scriptFilter;
        }

        // Invalid config command
        const item = new AlfredListItem()
            .title('Invalid config command')
            .subtitle('Use "config set server URL", "config set apikey KEY", or "config get"')
            .arg('Invalid config command')
            .variable('error', 'true')
            .variable('message', 'Invalid config command. Use "config set server URL", "config set apikey KEY", or "config get"');

        scriptFilter.addItem(item);
        return scriptFilter;
    }

    // Handle URL shortening
    try {
        // Check if we have a URL to shorten
        if (args.length < 1 || !args[0].includes('://')) {
            const item = new AlfredListItem()
                .title('Invalid URL')
                .subtitle('Please provide a valid URL to shorten (must include protocol, e.g., https://)')
                .arg('Invalid URL')
                .variable('error', 'true')
                .variable('message', 'Please provide a valid URL to shorten (must include protocol, e.g., https://)');

            scriptFilter.addItem(item);
            return scriptFilter;
        }

        const longUrl = args[0];
        const customSlug = args.length > 1 ? args[1] : null;

        const result = await createShortUrl(longUrl, customSlug);

        const item = new AlfredListItem()
            .title('URL shortened successfully!')
            .subtitle(result.shortUrl)
            .arg(result.shortUrl)
            .variable('shortUrl', result.shortUrl)
            .variable('longUrl', longUrl)
            .variable('message', 'URL shortened successfully!');

        scriptFilter.addItem(item);
        return scriptFilter;
    } catch (error) {
        const item = new AlfredListItem()
            .title('Error')
            .subtitle(`Error: ${error.message}`)
            .arg(`Error: ${error.message}`)
            .variable('error', 'true')
            .variable('message', `Error: ${error.message}`);

        scriptFilter.addItem(item);
        return scriptFilter;
    }
}

// Main function
export async function main(input = '') {
    try {
        const scriptFilter = await processAlfredInput(input);
        return scriptFilter;
    } catch (error) {
        const scriptFilter = new AlfredScriptFilter();

        const item = new AlfredListItem()
            .title('Error')
            .subtitle(`Error: ${error.message}`)
            .arg(`Error: ${error.message}`)
            .variable('error', 'true')
            .variable('message', `Error: ${error.message}`);

        scriptFilter.addItem(item);
        return scriptFilter;
    }
}
