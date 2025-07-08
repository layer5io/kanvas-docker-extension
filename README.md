<p style="text-align:center;" align="center"><a href="https://layer5.io/kanvas"><picture align="center">
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/layer5io/layer5/blob/master/ui/src/img/kanvas/horizontal/kanvas-horizontal-color.svg"  width="70%" align="center" style="margin-bottom:20px;">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/layer5io/layer5/blob/master/ui/src/img/kanvas/horizontal/kanvas-horizontal-partial-color.svg" width="70%" align="center" style="margin-bottom:20px;">
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

# Docker Extension for Kanvas

The Docker Extension for Kanvas extends Docker Desktop’s position as the cloud native developer’s go-to Kubernetes environment with easy access to the next layer of cloud native infrastructure. Kubernetes or not, though, Kanvas offers a visual topology for designing Docker Compose applications, operating Kubernetes, and Clouds. Kanvas brings deep support of 300+ different infrastructure models to the fingertips of Docker Desktop developers in connection with Docker Desktop’s ability to deliver Kubernetes locally.

<h2><a name="running"></a>Get Started with the Docker Extension for Kanvas</h2>

<h3>Using Docker Desktop</h3>
<p>Navigate to the Extensions area of Docker Desktop.</p>

<h3>Using <code>docker</code></h3>
<p>Kanvas runs as a set of containers inside your Docker Desktop virtual machine.</p>
<pre>docker extension install layer5/kanvas-docker-extension</pre>
<p>See the <a href="https://docs.layer5.io/kanvas/installation/quick-start">quick start</a> guide.</p>
<p style="clear:both;">&nbsp;</p>

## Using the Docker Extension for Kanvas

1. Install any service mesh with the check of a box.
1. Import your Docker Compose apps for visual design and deployment to Kubernetes and service meshes.

<p align="center"><a href="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-desktop-extension-for-meshery.png"><img src="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-desktop-extension-for-meshery.png" width="90%" align="center" /></a></p>

## Docker Extension for Kanvas Architecture

The Docker Extension for Kanvas deploys Kanvas to your local Docker host as a Docker Compose application.

<p align="center"><a href="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-extension-for-meshery-architecture.png"><img src="https://raw.githubusercontent.com/meshery/meshery/master/install/docker-extension/docs/img/docker-extension-for-meshery-architecture.png" width="90%" align="center" /></a></p>
Learn more about <a href="https://docs.layer5.io/kanvas">Kanvas's architecture</a>.

## Docker Extension for Kanvas

From `/install/docker-extension`, familiarize with available `make` targets by executing:

```
make
```

Review the available targets and their purpose. In general, follow this sequence when building and testing changes:

```
make extension
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
