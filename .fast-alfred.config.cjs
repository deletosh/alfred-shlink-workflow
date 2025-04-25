/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        productionScripts: ['src/main/*.js'],
        esmHelpers: true,
        outputFormat: 'esm',
        minify: false,
        treeShaking: true,
        rootAssets: ['icon.png', 'info.plist']
    }, workflowMetadata: {
        name: 'Shlink URL Shortener',
        description: 'Shorten URLs with Shlink',
        createdby: 'Dele Tosh',
        webaddress: 'https://deletosh.com',
        readme: `# Alfred Shlink Workflow

An Alfred workflow for macOS that allows you to use Shlink to shorten URLs with optional custom slugs.

## Features

- Shorten URLs using your existing Shlink instance
- Specify custom slugs (optional)
- Configure your Shlink server URL and API key
- Receive notifications for success/error states
- Automatically copy shortened URLs to the clipboard

## Prerequisites

- [Alfred](https://www.alfredapp.com/) with Powerpack (paid version)
- An existing [Shlink](https://shlink.io/) instance
- A valid Shlink API key
- [Bun](https://bun.sh) JavaScript runtime installed on your system

## Installation

1. Make sure you have Bun installed on your system
   \`\`\`bash
   # Install Bun if you don't have it already
   curl -fsSL https://bun.sh/install | bash
   \`\`\`

2. Download the latest release from the [releases page](https://github.com/deletosh/alfred-shlink-workflow/releases)
3. Double-click the downloaded \`.alfredworkflow\` file to install it in Alfred
4. Configure your Shlink server URL and API key (see the Configuration section below)

## Usage

### Basic Usage

To shorten a URL:

\`\`\`
shlink https://example.com
\`\`\`

The shortened URL will be automatically copied to your clipboard and a notification will appear.

### Using Custom Slugs

To shorten a URL with a custom slug:

\`\`\`
shlink https://example.com my-custom-slug
\`\`\`

This will create a short URL using your custom slug instead of a random one.

### Configuration

Before using the workflow, you need to configure your Shlink server URL and API key:

To set your Shlink server URL:

\`\`\`
shlink config set server https://your-shlink-server.com
\`\`\`

To set your API key:

\`\`\`
shlink config set apikey your-api-key
\`\`\`

To view your current configuration:

\`\`\`
shlink config get
\`\`\`

## Development

This workflow is built using the [fast-alfred](https://github.com/avivbens/fast-alfred) framework and [Bun](https://bun.sh) runtime.

`.trim()
    }
}
