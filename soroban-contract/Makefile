CONTRACT_NAME = clippay-core
WASM_PATH = target/wasm32v1-none/release/clippay_core.wasm
NETWORK = testnet
SOURCE_ACCOUNT = mi-wallet

.PHONY: build deploy test clean help

help:
	@echo "Comandos disponibles:"
	@echo "  make build      - Compilar el contrato"
	@echo "  make deploy     - Desplegar en testnet"
	@echo "  make test       - Ejecutar tests"
	@echo "  make clean      - Limpiar archivos generados"
	@echo ""
	@echo "Nota: Cambia SOURCE_ACCOUNT en el Makefile por tu cuenta"

build:
	stellar contract build

deploy: build
	stellar contract deploy \
	  --wasm $(WASM_PATH) \
	  --source-account $(SOURCE_ACCOUNT) \
	  --network $(NETWORK) \
	  --alias $(CONTRACT_NAME)

test:
	cargo test

clean:
	cargo clean
