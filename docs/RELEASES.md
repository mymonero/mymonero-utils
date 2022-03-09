<p align="center">
  <img alt="MyMonero" src="https://user-images.githubusercontent.com/1645428/146000939-b06f8fd3-9ed2-4a5e-bdd6-3981281dde9c.png">
</p>

<p align="center">
  MyMonero Utils
</p>

## Preparing and Publishing Releases

### Pre-requisites

You will need an up-to-date version of [NodeJS](https://nodejs.org) and [npm](https://github.com/npm/cli) installed on your system.

MyMonero contributors perform release using NodeJS version 16.0.0 or higher 

Prior to producing a release, ensure you run `lerna bootstrap` in your project's root folder.

### Build methodology

1. Merge in any new pull requests into the `develop` branch.
2. Once all features have been merged into `develop`, check out a new branch for the release.The naming convention should adhere to semantic versioning. For example, `git checkout -b release-vx.x.x` where 'x.x.x' is replaced with the new release version.
3. Push your branch to upstream: `git push -u origin release-vx.x.x`.
4. In the project root, run `lerna publish`, following the interactive prompts. Make sure you specify the version number that corresponds to the Git branch you've just uploaded.

The release will automatically be tagged on GitHub, and the various packages will be automatically uploaded to [npm](https://www.npmjs.org)

### Troubleshooting

Sometimes, a release might be tagged on Github, but an error will disrupt the publishing of the packages to NPM. 

In this case, do not create a new version with lerna. Instead, run `lerna publish --from-git`
