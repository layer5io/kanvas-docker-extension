include build/Makefile.core.mk
include build/Makefile.show-help.mk

IMAGE?=layer5/kanvas-docker-extension:edge-latest
NAME?=layer5/kanvas-docker-extension

BUILDER=buildx-multi-arch
STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

GIT_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)
GIT_STRIPPED_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1` | cut -c 2-)
GIT_REF=$(shell git symbolic-ref HEAD 2>/dev/null || echo "refs/heads/main")
RELEASE_CHANNEL=$(shell if [[ $(GIT_REF) == refs/tags* ]]; then echo "stable"; else echo "edge"; fi)

release-channel:
	GIT_VERSION=$(GIT_VERSION)
	GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION)
	GIT_REF=$(GIT_REF)
	RELEASE_CHANNEL=$(RELEASE_CHANNEL)

## Build the vm binary for the current platform
bin:
	@echo "$(INFO_COLOR)Building...$(NO_COLOR)"
	$(GO_BUILD) -o bin/service ./vm

## Build service image to be deployed as a Docker extension
extension-build:
	docker build --tag=$(IMAGE) --build-arg GIT_VERSION=$(GIT_VERSION) --build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) .

## Build extension container with no cache
extension-no-cache:
	docker build --tag=$(IMAGE) --no-cache --build-arg GIT_VERSION=$(GIT_VERSION) --build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) .

## Create buildx builder for multi-arch build.
buildx-prepare:
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

## Build & Upload extension image to hub. Do not push if tag already exists.
extension-build-push: buildx-prepare
	docker pull $(IMAGE):$(RELEASE_CHANNEL)-$(GIT_VERSION) && echo "Failure: Tag already exists" || \
	docker buildx build --push \
	--builder=$(BUILDER) --platform=linux/amd64,linux/arm64 \
	--build-arg RELEASE_CHANNEL=$(RELEASE_CHANNEL) \
	--build-arg GIT_VERSION=$(GIT_VERSION) \
	--build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) \
	--tag=$(IMAGE):$(RELEASE_CHANNEL)-latest \
	--tag=$(IMAGE):$(RELEASE_CHANNEL)-$(GIT_VERSION)
	--tag=$(GIT_VERSION) .

## Build UI. Produce local package.
ui-build:
	cd ui/src; npm install; npm run build; cd ../..;

## Run UI on local port
ui:
	cd ui/src; npm install; npm run start; cd ../..;

## Make easier to debug the UI
extension-link:
	docker extension dev ui-source $(IMAGE) http://localhost:3000
	docker extension dev debug $(NAME)

## docker extension dev reset
extension-reset:
	docker extension dev reset $(IMAGE)

## docker extension install
extension-install:
	docker extension install $(IMAGE) --force

## Remove the extension
extension-remove:
	docker extension remove $(IMAGE) || true

## Enable debug mode for the extension
enable-debug-mode:
	docker extension dev debug $(NAME)

## Build the extension and install it
build-dev: extension-remove extension extension-install enable-debug-mode

.PHONY: buildx-prepare push-extension extension ui bin build-dev enable-debug-mode extension-install extension-link extension-reset extension-remove
