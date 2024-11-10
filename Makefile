.PHONY: install dev build preview clean lint help

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev     - Start development server"
	@echo "  make build   - Build for production"
	@echo "  make preview - Preview production build"
	@echo "  make clean   - Remove build artifacts and dependencies"

format:
	npm run format

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

clean:
	rm -rf dist node_modules
