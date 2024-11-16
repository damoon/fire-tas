.PHONY: format node_modules dev build preview clean lint help

help:
	@echo "Available commands:"
	@echo "  make help    - Show this help"
	@echo "  make format  - Format code"
	@echo "  make node_modules  - Install dependencies"
	@echo "  make dev     - Start development server"
	@echo "  make build   - Build for production"
	@echo "  make preview - Preview production build"
	@echo "  make clean   - Remove build artifacts and dependencies"

format: node_modules
	npm run format

node_modules: package.json package-lock.json
	npm install

dev: node_modules
	npm run dev

build: node_modules
	npm run build

preview: build
	npm run preview

clean:
	rm -rf dist node_modules
