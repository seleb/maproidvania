## [2.3.1](https://github.com/seleb/maproidvania/compare/v2.3.0...v2.3.1) (2024-06-15)


### Bug Fixes

* reset action name ([b1db796](https://github.com/seleb/maproidvania/commit/b1db796c18c558ca9e3c818446cf70e7cd54479f))

# [2.3.0](https://github.com/seleb/maproidvania/compare/v2.2.0...v2.3.0) (2024-06-14)


### Features

* add "new map" button to reset data ([e72e77c](https://github.com/seleb/maproidvania/commit/e72e77cb569417d1e8bc0afc6be7c6582b7d9211))

# [2.2.0](https://github.com/seleb/maproidvania/compare/v2.1.0...v2.2.0) (2024-06-09)


### Bug Fixes

* controls overflowing document ([38d8d95](https://github.com/seleb/maproidvania/commit/38d8d95d9da06fd55e7e5e2ebd63c957dc8c3f47))


### Features

* `f` centers + zooms out ([3e5462d](https://github.com/seleb/maproidvania/commit/3e5462d35899380c7095fd23ce3a6f8f3b344314))
* focus offsets by better ratio of controls vs map ([e255dde](https://github.com/seleb/maproidvania/commit/e255dde9446569a4101ec65571ebe68072ac8053))
* ping focused spot on map ([1e1bf38](https://github.com/seleb/maproidvania/commit/1e1bf38c19da5a6e891a081d31bd0f96576961cb))

# [2.1.0](https://github.com/seleb/maproidvania/compare/v2.0.2...v2.1.0) (2024-06-08)


### Bug Fixes

* handle import cancel ([d1242c6](https://github.com/seleb/maproidvania/commit/d1242c686fb1bad7c0bb72d72f3d3e5d87424a76))


### Features

* blocking overlay while saving/exporting/importing ([131bacd](https://github.com/seleb/maproidvania/commit/131bacdc58c2f735132b017ff96107db1ef5c985))

## [2.0.2](https://github.com/seleb/maproidvania/compare/v2.0.1...v2.0.2) (2024-06-08)


### Bug Fixes

* decode file iteratively to fix memory limit issue ([e321a6d](https://github.com/seleb/maproidvania/commit/e321a6d787f31dbc3edc0c20b352a2e3deab57b0))

## [2.0.1](https://github.com/seleb/maproidvania/compare/v2.0.0...v2.0.1) (2024-06-08)


### Bug Fixes

* try fixing save issue with `flat` ([17c5637](https://github.com/seleb/maproidvania/commit/17c56377a7de523d450c7fb69f4cec891bfe3287))
* write each entry to file handle separately ([354de23](https://github.com/seleb/maproidvania/commit/354de23adeb023c041e3dd3feb989bafc9d7ccb4))

# [2.0.0](https://github.com/seleb/maproidvania/compare/v1.6.1...v2.0.0) (2024-06-08)


### Bug Fixes

* try fixing save issue with `flatted` ([030b546](https://github.com/seleb/maproidvania/commit/030b54648c05f547b0d980a31b48fb7a4543585a))


### BREAKING CHANGES

* save file format changed

## [1.6.1](https://github.com/seleb/maproidvania/compare/v1.6.0...v1.6.1) (2024-06-08)


### Bug Fixes

* split up json stringify ([be2d062](https://github.com/seleb/maproidvania/commit/be2d0628160f3a4421b44128d8db2640094f1bf3))

# [1.6.0](https://github.com/seleb/maproidvania/compare/v1.5.1...v1.6.0) (2024-06-08)


### Bug Fixes

* brush drawing at wrong size when zoomed ([62cb401](https://github.com/seleb/maproidvania/commit/62cb4010816d100837f56cef363d2f687c014aa4))
* brush size not applied on load ([77be659](https://github.com/seleb/maproidvania/commit/77be6594f4493d2ceaf06b34e28bf94f0673a57f))
* cursor not showing proper brush size ([45d1501](https://github.com/seleb/maproidvania/commit/45d15011e30fba8f7e9ce66d3a28ab9e49b71987))
* double default brush size to compensate for other size fixes ([d5fd2a4](https://github.com/seleb/maproidvania/commit/d5fd2a4464718c50cc426d16ea00a1635c393239))
* search focus offsets by width of search results ([9562c2c](https://github.com/seleb/maproidvania/commit/9562c2cbcc3f2e781bd12f7bbebcc4c317c071ab))


### Features

* double click search result to zoom in ([611e819](https://github.com/seleb/maproidvania/commit/611e819ec4e49c596a96eccc8778d8c8944a7cd6))

## [1.5.1](https://github.com/seleb/maproidvania/compare/v1.5.0...v1.5.1) (2024-06-04)


### Bug Fixes

* area with `-` in name breaking search ([5d69021](https://github.com/seleb/maproidvania/commit/5d69021e6cea7a1d1e992a423506ca7bd8944953))

# [1.5.0](https://github.com/seleb/maproidvania/compare/v1.4.2...v1.5.0) (2024-06-03)


### Bug Fixes

* pin type fallback while editing ([cee21d5](https://github.com/seleb/maproidvania/commit/cee21d548638012f0d664a2005eea4b53934ebd2))


### Features

* suggest default pin types in context menu ([d46c054](https://github.com/seleb/maproidvania/commit/d46c05442856ba0b456d23c3ace9f5154e88182e))

## [1.4.2](https://github.com/seleb/maproidvania/compare/v1.4.1...v1.4.2) (2024-06-03)


### Bug Fixes

* deselect pin when focusing search result ([aacabc7](https://github.com/seleb/maproidvania/commit/aacabc79d429b3dbd2e4dbed513d652b5d872a28))

## [1.4.1](https://github.com/seleb/maproidvania/compare/v1.4.0...v1.4.1) (2024-06-03)


### Bug Fixes

* deselect when changing areas ([a01e9e3](https://github.com/seleb/maproidvania/commit/a01e9e3703c835a9e21f74085af279b01a4b8665))
* don't change area if it's the same one ([0b260ae](https://github.com/seleb/maproidvania/commit/0b260ae44c70c7dc7d66afa5f2c588c7560e296f))

# [1.4.0](https://github.com/seleb/maproidvania/compare/v1.3.0...v1.4.0) (2024-06-03)


### Bug Fixes

* fallback for no pin type ([45f0734](https://github.com/seleb/maproidvania/commit/45f0734b46adae8714aefb822a76a28ff86d6332))


### Features

* edit pin type from context menu ([968d121](https://github.com/seleb/maproidvania/commit/968d1213ccf49c81533ed2680e11a9af1f80d290))

# [1.3.0](https://github.com/seleb/maproidvania/compare/v1.2.2...v1.3.0) (2024-06-02)


### Features

* add door to default pins ([71cb6c0](https://github.com/seleb/maproidvania/commit/71cb6c0fc40916f69d86d03374e39bf09b36278a))

## [1.2.2](https://github.com/seleb/maproidvania/compare/v1.2.1...v1.2.2) (2024-06-02)


### Bug Fixes

* improve tool selection ([8273ea7](https://github.com/seleb/maproidvania/commit/8273ea79602dc5139f369958a30c1b9b287af3b5))
* taller notes ([371a392](https://github.com/seleb/maproidvania/commit/371a39210ea2ca15c179ed6aa8987f0719a2049c))

## [1.2.1](https://github.com/seleb/maproidvania/compare/v1.2.0...v1.2.1) (2024-06-02)


### Bug Fixes

* wider notes ([3830459](https://github.com/seleb/maproidvania/commit/38304598677362f990d1e483a3ac8c220cd328bd))

# [1.2.0](https://github.com/seleb/maproidvania/compare/v1.1.0...v1.2.0) (2024-06-02)


### Features

* hotkeys for select/text/draw/pin ([fd598e1](https://github.com/seleb/maproidvania/commit/fd598e16ef9477381b7513ecf76c115ab4ab8543))

# [1.1.0](https://github.com/seleb/maproidvania/compare/v1.0.3...v1.1.0) (2024-06-02)


### Bug Fixes

* missing undo/redo on deleting pin image ([f9db72b](https://github.com/seleb/maproidvania/commit/f9db72b4f1ea2f7af321d4d1ef5017e7c7654cb3))


### Features

* warn about unsaved changes ([bb2d001](https://github.com/seleb/maproidvania/commit/bb2d00196ef9235b836952ff3455a75b3c188fed))

## [1.0.3](https://github.com/seleb/maproidvania/compare/v1.0.2...v1.0.3) (2024-05-31)


### Bug Fixes

* clearer error for lack of support on firefox ([9559b89](https://github.com/seleb/maproidvania/commit/9559b89a439e74999c9b02e1f86e173c19f57a9f))
* contenteditable on firefox ([f444bdc](https://github.com/seleb/maproidvania/commit/f444bdce7d330499e670553f966611161a16978e))

## [1.0.2](https://github.com/seleb/maproidvania/compare/v1.0.1...v1.0.2) (2024-05-31)


### Bug Fixes

* urls ([c9aa65e](https://github.com/seleb/maproidvania/commit/c9aa65e08b657ab6d011cd52828e827f4c848c6f))

## [1.0.1](https://github.com/seleb/maproidvania/compare/v1.0.0...v1.0.1) (2024-05-31)


### Bug Fixes

* grid not importing ([0ca420b](https://github.com/seleb/maproidvania/commit/0ca420b726439876f5938db69a18dcaff5b5f51f))

# 1.0.0 (2024-05-31)


### Features

* initial release ([65f085d](https://github.com/seleb/maproidvania/commit/65f085d5993bddda6dd4c6f4afe97ef60905d290))
