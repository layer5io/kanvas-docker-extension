
# include ../Makefile.core.mk
# include ../Makefile.show-help.mk

IMAGE?=layer5/kanvas-docker-extension:edge-latest
NAME?=layer5/kanvas-docker-extension

BUILDER=buildx-multi-arch
STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

GIT_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)
GIT_STRIPPED_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1` | cut -c 2-)
GIT_REF=$(shell git symbolic-ref HEAD)
RELEASE_CHANNEL=$(shell ./release_channel.sh)

release-channel:
	GIT_VERSION=$(GIT_VERSION)
	GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION)
	GIT_REF=$(GIT_REF)
	RELEASE_CHANNEL=$(RELEASE_CHANNEL)

## Build the binary for the current platform
bin:
	@echo "$(INFO_COLOR)Building...$(NO_COLOR)"
	$(GO_BUILD) -o bin/service ./vm

## Build service image to be deployed as a Docker extension
extension:
	docker build --tag=$(IMAGE) --build-arg GIT_VERSION=$(GIT_VERSION) --build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) .

extension-no-cache:
	docker build --tag=$(IMAGE) --no-cache --build-arg GIT_VERSION=$(GIT_VERSION) --build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) .

## Create buildx builder for multi-arch build.
prepare-buildx:
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

## Build & Upload extension image to hub. Do not push if tag already exists.
push-extension: prepare-buildx
	docker pull $(IMAGE):$(RELEASE_CHANNEL)-$(GIT_VERSION) && echo "Failure: Tag already exists" || \
	docker buildx build --push \
	--builder=$(BUILDER) --platform=linux/amd64,linux/arm64 \
	--build-arg RELEASE_CHANNEL=$(RELEASE_CHANNEL) \
	--build-arg GIT_VERSION=$(GIT_VERSION) \
	--build-arg GIT_STRIPPED_VERSION=$(GIT_STRIPPED_VERSION) \
	--tag=$(IMAGE):$(RELEASE_CHANNEL)-latest \
	--tag=$(IMAGE):$(RELEASE_CHANNEL)-$(GIT_VERSION)
	--tag=$(GIT_VERSION) .

ui-build:
	cd ui/src; npm install; npm run build; cd ../..;

ui:
	cd ui/src; npm run start; cd ../..;
# Make easier to debug the UI
link:
	docker extension dev ui-source $(IMAGE) http://localhost:3000
	docker extension dev debug $(NAME)
reset:
	docker extension dev reset $(IMAGE)

install-extension:
	docker extension install $(IMAGE) --force

remove-extension:
	docker extension remove $(IMAGE) || true


enable-debug-mode:
	docker extension dev debug $(NAME)

build-dev: remove-extension extension install-extension enable-debug-mode

.PHONY: prepare-buildx push-extension extension ui bin build-dev enable-debug-mode install-extension
