<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<p align="center">
  MyMonero Utils
</p>

## Preparing and Publishing Releases

### Pre-requisites

You will need an up-to-date version of [NodeJS](https://nodejs.org) and [npm](https://github.com/npm/cli) installed on your system.

MyMonero maintainers perform all releases using NodeJS version 16.0.0 or higher 

## Build methodology

#### Merge new features

Merge in any new pull requests into the `develop` branch.

#### Bootstrap the project using Lerna

Certain packages are made available as CommonJS modules. To facilitate this, they need to be installed properly in order to have them transpiled correctly.

Prior to producing a release, ensure you run:
```bash
lerna bootstrap
``` 

#### Checkout a new branch for the release 
Once all features have been merged into `develop`, check out a new branch for the release. The naming convention should adhere to semantic versioning. In the following command, replace 'x.x.x' with the new release version.

```bash
git checkout -b release-vx.x.x
```

#### Push branch upstream 
Push your branch to upstream: 

```bash
git push -u origin release-vx.x.x
```

#### Publish release using lerna
In the project root, run lerna and follow the interactive prompts. Make sure you specify the version number that corresponds to the Git branch you've just uploaded.

```bash
lerna publish
```

The release will automatically be tagged on GitHub, and the various packages will be automatically uploaded to [npm](https://www.npmjs.org)

#### Merging back into `develop` and `master` branches once released

Every release should be merged into develop.

Merges to `master` should be performed every time a minor or major release is performed. If a release is a patch, develop should be merged into master after a specified time period of seven calendar days.  

##### Minor / Major Updates (e.g. v1.0.0 -> v1.1.0 or v1.0.0 -> v2.0.0)

Minor and major updates are always merged back to develop before any new PRs to develop are merged.

On GitHub, open a pull request to `develop` from `release-vx.x.x` and merge it

Once merged with `develop`, minor and major updates are to be merged into `master`

On GitHub, open a pull request to `master` from `develop` and merge it

##### Patch Updates (e.g. v1.0.0 -> v1.0.1)

Patch updates are always merged back to develop before any new PRs to develop are merged.

On GitHub, open a pull request to `develop` from `release-vx.x.x` and merge it

Patches are to be merged back into master after the `develop` branch remains unchanged for seven calendar days


### Troubleshooting

Sometimes, a release might be tagged on Github, but an error will disrupt the publishing of the packages to NPM. 

In this case, do not create a new version with lerna. Instead, run 
```bash
lerna publish --from-git
```