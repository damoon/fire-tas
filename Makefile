# Money Value Optimizer Makefile

.PHONY: install serve build lint help

# Install dependencies
install:
	npm install

# Run development server with hot-reload
serve:
	npm run serve

# Build for production
build:
	npm run build

# Lint and fix files
lint:
	npm run lint

# Help target
help:
	@echo "Available commands:"
	@echo "  make install  - Install project dependencies"
	@echo "  make serve   - Start development server with hot-reload"
	@echo "  make build   - Build for production"
	@echo "  make lint    - Lint and fix files"