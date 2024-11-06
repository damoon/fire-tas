.PHONY: install dev build preview clean lint help

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev     - Start development server"
	@echo "  make build   - Build for production"
	@echo "  make preview - Preview production build"
	@echo "  make clean   - Remove build artifacts and dependencies"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist node_modules

lint:
	npm run lint
