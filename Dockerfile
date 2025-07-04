FROM golang:1.23-alpine AS builder
ENV CGO_ENABLED=0
RUN apk update && apk add  gcc libc-dev make
WORKDIR /backend
COPY go.* .
ARG TARGETARCH
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  make bin

FROM node:14.17-alpine3.13 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json ui/package-lock.json ./
ARG TARGETARCH
RUN --mount=type=cache,target=/root/.npm \
  npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
ARG GIT_STRIPPED_VERSION
ARG GIT_VERSION
ARG RELEASE_CHANNEL
LABEL org.opencontainers.image.title="Kanvas" \
  org.opencontainers.image.description="Kanvas, the collaborative Kubernetes manager. Go multi-player as you design and operate your cloud native infrastructure with teammates." \
  org.opencontainers.image.vendor="Layer5, Inc." \
  com.docker.desktop.extension.api.version=">= 0.2.0" \
   com.docker.extension.screenshots="[ \
      { \
        \"alt\": \"Kanvas Docker Extension\", \
        \"url\": \"https://raw.githubusercontent.com/layer5io/kanvas-docker-extension/master/assets/docker-extension-home.png\" \
      },{ \
        \"alt\": \"Kanvas Docker Extension\", \
        \"url\": \"https://raw.githubusercontent.com/layer5io/kanvas-docker-extension/master/assets/kanvas-designer.png\" \
      } \
    ]" \
  com.docker.extension.detailed-description="\
  <h2>Visually and collaboratively design and operate your Kubernetes clusters (<a href='https://meshery.io/catalog'>video</a>).</h2> \
  <p>The Kanvas Docker Extension is your cloud native infrastructure designer, complete with multi-cluster Kubernetes management. Kanvas provides cloud native engineers with visual and collaborative interface to designing and operating cloud native infrastructure.</p> \
  <ul> \
    <li><b>Discovery of your Kubernetes environments</b> - Meshery is a multi-cluster manager and will scan your kubeconfig, allowing you to select which of your Kubernetes contexts to connect. Switch from one K8s cluster to the next or manage multiple concurrently.</li> \
    <li><b>Support for your Docker Compose apps -</b> Import your Docker Compose apps. Configure and deploy them to Kubernetes.</li> \
    <li><b>Visual designer for Docker Compose apps, Helm charts, and Kubernetes manifests -</b> No code, visual topology for designing Docker Compose applications, operating Kubernetes and their workloads.</li> \
    <li><b>Save time with design patterns - </b>Turbo-charge your infrastructure with best practice cloud native design patterns from the <a href='https://meshery.io/catalog'>Meshery Catalog</a>.</li> \
    <li><b>Single-click deployment of all cloud native infrastructure -</b> Support for hundreds of different cloud native infrastructure tools right at your fingertips.</li> \
  </ul>" \
  com.docker.desktop.extension.icon="https://raw.githubusercontent.com/layer5io/kanvas-docker-extension/master/assets/kanvas-designer.png" \
  com.docker.extension.publisher-url="https://layer5.io" \
  com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://docs.layer5.io\"},{\"title\":\"Project\",\"url\":\"https://layer5.io\"},{\"title\":\"Slack\",\"url\":\"https://slack.meshery.io\"},{\"title\":\"Discussion Forum\",\"url\":\"https://layer5.io/community#community-forums\"}]"
COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY assets/kanvas-mark-logo-light.svg .
COPY --from=client-builder /ui/build ui
EXPOSE 7877/tcp
CMD ["./service"]
