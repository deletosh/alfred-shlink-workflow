# Alfred Shlink Workflow

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
   ```bash
   # Install Bun if you don't have it already
   curl -fsSL https://bun.sh/install | bash
   ```

2. Download the latest release from the [releases page](https://github.com/deletosh/alfred-shlink-workflow/releases)
3. Double-click the downloaded `.alfredworkflow` file to install it in Alfred
4. Configure your Shlink server URL and API key (see the Configuration section below)

## Usage

### Basic Usage

To shorten a URL:

```
shlink https://example.com
```

The shortened URL will be automatically copied to your clipboard and a notification will appear.

### Using Custom Slugs

To shorten a URL with a custom slug:

```
shlink https://example.com my-custom-slug
```

This will create a short URL using your custom slug instead of a random one.

### Configuration

Before using the workflow, you need to configure your Shlink server URL and API key:

To set your Shlink server URL:

```
shlink config set server https://your-shlink-server.com
```

To set your API key:

```
shlink config set apikey your-api-key
```

To view your current configuration:

```
shlink config get
```

## Development

This workflow is built using the [fast-alfred](https://github.com/avivbens/fast-alfred) framework and [Bun](https://bun.sh) runtime.

### Building from Source

1. Clone this repository
2. Navigate to the cloned directory
3. Install dependencies:
   ```bash
   bun install
   ```
4. Build the workflow:
   ```bash
   bun run build
   ```
   This will generate a `.alfredworkflow` file in the project root.

### Development Workflow

1. Make changes to the code in the `src/main` directory
2. Run the development server:
   ```bash
   bun run dev
   ```
3. Test your changes in Alfred

### Project Structure

```
Alfred-Shlink-Workflow/
├── .github/                    # GitHub configuration
│   └── workflows/              # GitHub Actions workflows
│       └── release.yml         # Workflow for building and releasing
├── src/                        # Source code
│   └── main/                   # Main entry points
│       └── index.js            # Main script
├── .fast-alfred.config.cjs     # fast-alfred configuration
├── info.plist                  # Alfred workflow configuration
├── icon.png                    # Workflow icon
├── package.json                # Node.js package configuration
└── README.md                   # This file
```

### Releasing

This project uses GitHub Actions to automatically build and release the workflow. To create a new release:

1. Update the version in `package.json`
2. Commit your changes
3. Create and push a new tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. GitHub Actions will automatically build and create a release with the `.alfredworkflow` file

## License

MIT License—see the LICENSE file for details.

## Acknowledgements

- [Shlink](https://shlink.io/) - The self-hosted URL shortener
- [Alfred](https://www.alfredapp.com/) - The productivity app for macOS

## Troubleshooting

If you encounter any issues:

1. Ensure your Shlink server URL is correct and includes the protocol (http:// or https://)
2. Verify your API key is valid
3. Check Alfred's debug console for error messages

For more help, please [create an issue](https://github.com/deletosh/alfred-shlink-workflow/issues) on GitHub.
