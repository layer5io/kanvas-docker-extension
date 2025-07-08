<p style="text-align:center;" align="center"><a href="https://layer5.io/kanvas"><picture align="center">
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/layer5io/kanvas-docker-extension/blob/master/ui/src/img/kanvas/horizontal/kanvas-horizontal-color.svg"  width="70%" align="center" style="margin-bottom:20px;">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/layer5io/kanvas-docker-extension/blob/master/ui/src/img/kanvas/horizontal/kanvas-horizontal-partial-color.svg" width="70%" align="center" style="margin-bottom:20px;">
  <img alt="Shows an illustrated light mode meshery logo in light color mode and a dark mode Kanvas logo in dark color mode." src="https://raw.githubusercontent.com/layer5io/kanvas-docker-extension/master/ui/src/img/kanvas/horizontal/kanvas-horizontal-partial-color.svg" width="70%" align="center" style="margin-bottom:20px;">
</picture></a><br /><br /></p>

<p align="center">
<a href="https://hub.docker.com/r/layer5/kanvas-docker-extension" alt="Docker pulls">
  <img src="https://img.shields.io/docker/pulls/layer5/kanvas.svg" /></a>
<a href="https://github.com/issues?utf8=✓&q=is%3Aopen+is%3Aissue+archived%3Afalse+org%meshery-extensions+org%layer5io+org%layer5labs+label%3A%22help+wanted%22+" alt="GitHub issues by-label">
  <img src="https://img.shields.io/github/issues/layer5io/layer5/help%20wanted.svg?color=informational" /></a>
<a href="https://github.com/layer5io/layer5/blob/master/LICENSE" alt="LICENSE">
  <img src="https://img.shields.io/github/license/layer5io/layer5?color=brightgreen" /></a>
<a href="https://goreportcard.com/report/github.com/layer5io/layer5" alt="Go Report Card">
  <img src="https://goreportcard.com/badge/github.com/layer5io/layer5" /></a>
<a href="https://github.com/layer5io/docs/actions" alt="Build Status">
  <img src="https://img.shields.io/github/workflow/status/meshery/meshery/Kanvas%20Build%20and%20Releaser%20(edge)" /></a>
<a href="https://bestpractices.coreinfrastructure.org/projects/3564" alt="CLI Best Practices">
  <img src="https://bestpractices.coreinfrastructure.org/projects/3564/badge" /></a>
<a href="https://discuss.layer5.io" alt="Discuss Users">
  <img src="https://img.shields.io/discourse/users?label=discuss&logo=discourse&server=https%3A%2F%2Fdiscuss.layer5.io" /></a>
<a href="https://slack.layer5.io" alt="Join Slack">
  <img src="https://img.shields.io/badge/Slack-@kanvas.svg?logo=slack"></a>
<a href="https://twitter.com/intent/follow?screen_name=layer5" alt="X Follow">
  <img src="https://img.shields.io/twitter/follow/layer5.svg?label=Follow+Kanvas&style=social" /></a>
</p>

[Kanvas](https://layer5.io/kanvas) delivers collaborative and visual configuration management offering lifecycle, configuration, and performance management of Kubernetes, public Clouds, and your workloads.

# Kanvas Extension for Docker

**What is Kanvas?**

Kanvas is a collaborative platform designed for engineers to visualize, manage, and design multi-cloud and Kubernetes-native infrastructure. Built on top of Meshery, one of the Cloud Native Computing Foundation’s high-velocity open source projects, Kanvas offers two modes to cater to different DevOps workflows:

* **Designer Mode**: Create and configure your infrastructure visually using a palette of components provided by Meshery. Drag-and-drop thousands of versioned Kubernetes components and use context-aware relationships to build your designs.  
* **Operator Mode**: Manage Kubernetes clusters and cloud native infrastructure in real-time. Deploy designs, apply patterns, manage deployments and services, and interactively connect to pods and containers for debugging and troubleshooting.

Kanvas simplifies the complexity of Kubernetes and multi-cloud management, making it accessible to all engineers, regardless of their expertise level. It’s like having a Google Workspace for DevOps, enabling collaborative creation, testing, and deployment of cloud native architectures.

**Key Features for Docker Users**

The Kanvas extension for Docker brings several powerful features that enhance the Docker experience:

| Feature | Description |
| ----- | ----- |
| **Import and Deploy Docker Compose Apps** | Easily import your Docker Compose applications and deploy them to Kubernetes with a few clicks, streamlining the transition to Kubernetes-based workflows. Kubernetes manifests, Helm charts, and Kustomize configurations are also supported. |
| **Visual Designer** | Use Kanvas’s intuitive interface to design your cloud native applications and infrastructure visually, supporting Kubernetes and public cloud services like AWS, Azure, and GCP. |
| **Single-Click Deployments** | Deploy Kubernetes infrastructure, including 300+ Kubernetes operators and various cloud services, with single clicks, reducing setup time. |
| **Multi-Environment Management** | Detect and manage multiple Kubernetes environments seamlessly, allowing you to switch between clusters or manage them concurrently. |
| **Collaboration** | Work collaboratively with your team in real-time, ensuring everyone is on the same page when designing and managing infrastructure. |

Kanvas also supports exporting designs as OCI-compliant container images, which can be pushed to registries like Docker Hub, GitHub Container Registry, or AWS ECR, integrating seamlessly with Docker-based workflows.

**Why Kanvas Matters for Docker Users**

Docker users often transition to Kubernetes for advanced orchestration and scalability. Kanvas bridges this gap by providing a visual, no-code designer that makes Kubernetes and cloud native infrastructure management intuitive and accessible. Whether you’re a developer, DevOps engineer, or SRE, Kanvas empowers you to:

* **Visualize Complex Configurations**: Render Kubernetes configurations visually to better understand and manage your infrastructure.  
* **Collaborate in Real-Time**: Avoid miscommunication and streamline teamwork with real-time collaboration features.  
* **Deploy Across Environments**: Manage multi-cloud and Kubernetes environments directly from Docker, enhancing flexibility and control.

As Docker continues to be a cornerstone of containerization, Kanvas enhances the Docker experience by integrating seamlessly with Docker Compose and Kubernetes workflows. It’s particularly valuable for teams looking to adopt Kubernetes without the steep learning curve or those managing complex, multi-cloud environments.

## Using the Docker Extension for Kanvas

1. Install any service mesh with the check of a box.
1. Import your Docker Compose apps for visual design and deployment to Kubernetes and service meshes.

<p align="center"><a href="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-desktop-extension-for-meshery.png"><img src="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-desktop-extension-for-meshery.png" width="90%" align="center" /></a></p>


## Contributing

From the root of your fork, familiarize with available `make` targets by executing:

```
make
```

Review the available targets and their purpose. In general, follow this sequence when building and testing changes:


```
make build-dev
```

Or use any of the other `make` targets, like these:

```
make extension-build
```

Once build is complete:

```
docker extension install layer5/kanvas-docker-extension:edge-latest
```

Or reinstall with:

```
docker extension update layer5/kanvas-docker-extension:edge-latest
```

<p style="text-align:center; width:100%;" align="center">
<a href ="https://layer5.io/community"><img alt="MeshMates" src="https://docs.meshery.io/assets/img/readme/community.svg" style="margin-right:10px; margin-bottom:7px;" width="28%" align="center" /></a>
</p>
<p style="text-align:center; width:100%;" align="center">
<h3 style="text-align:center;" align="center"><em>Have questions? Need help?</em> <strong>Ask in the <a href="https://discuss.layer5.io">Community Forum</a></strong>.</h3></p>
