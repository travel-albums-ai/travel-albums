## [1.28.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.27.0...v1.28.0) (2026-08-04)

## [1.27.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.26.0...v1.27.0) (2026-08-04)

## [1.26.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.25.1...v1.26.0) (2026-08-03)

### ✨ Features

* update emoji in README to reflect cloud service context ([a498810](https://github.com/travel-albums-ai/travel-albums/commit/a498810f7c26c89d4b25fa59803d40ba60f6a8b7))

### 🧹 Refactors

* streamline bun package build process by removing obsolete script and updating workflow ([8a0c86d](https://github.com/travel-albums-ai/travel-albums/commit/8a0c86dd3282616238c15c3099ac2d2da375949f))

### 🔧 Chore

* set retention days for bun executables workflow artifact ([4b0e050](https://github.com/travel-albums-ai/travel-albums/commit/4b0e050df4573c0e5c06c59a2903978c9adf900c))

## [1.25.1](https://github.com/travel-albums-ai/travel-albums/compare/v1.25.0...v1.25.1) (2026-08-03)

### 🐛 Fixes

* reorder steps in release workflow for bun package build ([96b3d2e](https://github.com/travel-albums-ai/travel-albums/commit/96b3d2ed33636924bf666ee2a5a32e675d288717))

## [1.25.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.24.1...v1.25.0) (2026-08-03)

### ✨ Features

* separate bun installation and add build script for bun packages ([e255fb3](https://github.com/travel-albums-ai/travel-albums/commit/e255fb38d90f409f861dbc1f79f33a5667f2170a))

## [1.24.1](https://github.com/travel-albums-ai/travel-albums/compare/v1.24.0...v1.24.1) (2026-08-03)

### 🐛 Fixes

* update artifact paths to match new naming convention for executables ([913b954](https://github.com/travel-albums-ai/travel-albums/commit/913b954fc7c340f0989746207feefd58d58a2b58))

### 🧹 Refactors

* remove redundant step for attaching executables to release in workflow ([731bf5b](https://github.com/travel-albums-ai/travel-albums/commit/731bf5b769547ebf36ec8209e41557853af57324))

## [1.24.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.23.0...v1.24.0) (2026-08-03)

### ✨ Features

* enhance release workflow by adding .exe file upload and build scripts for bun package ([3118b43](https://github.com/travel-albums-ai/travel-albums/commit/3118b4385ae5b45748acf829ed172e75ea2f3ecd))
* install bun globally during dependency setup in release workflow ([7692d58](https://github.com/travel-albums-ai/travel-albums/commit/7692d580890f0cff2676038109607515aa36577f))
* update release workflow to use actions/upload-artifact@v4 and streamline .exe file handling ([fa418f3](https://github.com/travel-albums-ai/travel-albums/commit/fa418f323549b264c716272be032183e098d1650))

### 🐛 Fixes

* correct syntax error in GitHub plugin configuration ([30e1018](https://github.com/travel-albums-ai/travel-albums/commit/30e1018957967ac1632d11bdefb98e4e72f7f246))

### 🧹 Refactors

* remove unused code and simplify FolderHandlersDrawer component structure ([4556259](https://github.com/travel-albums-ai/travel-albums/commit/455625977cdc2b473e61496ffbd39841b4773412))
* streamline FolderHandlersDrawer component by simplifying folder management and improving UI layout ([69af099](https://github.com/travel-albums-ai/travel-albums/commit/69af099de5b1eb48d662c97d8dfb1c0d558ea7c6))

## [1.23.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.22.0...v1.23.0) (2026-08-03)

### ✨ Features

* add FolderHandlersDrawer component for managing folder uploads and organization ([39c051f](https://github.com/travel-albums-ai/travel-albums/commit/39c051fcb369255049a51eb9b4f2eccd443529df))

### 🧹 Refactors

* enhance AlbumScroller component with preview functionality and improved state management ([2d61485](https://github.com/travel-albums-ai/travel-albums/commit/2d6148523d4129a2e8ecdcb5ecddd6b97eacf82b))
* enhance AlbumScroller component with responsive container width handling and improved photo alignment ([7283b2e](https://github.com/travel-albums-ai/travel-albums/commit/7283b2eae3e849c09c1a4cc0b3712aae5445e718))
* enhance AllPhotosRowsVirtuoso component for improved photo scrolling and code clarity ([a62070a](https://github.com/travel-albums-ai/travel-albums/commit/a62070a4db60775eb47c357db769e1ba2d534f8e))
* improve wheel event handling in AlbumScroller component by targeting the container element ([b2e679c](https://github.com/travel-albums-ai/travel-albums/commit/b2e679c068f5a31d68916525f9530d420eaeb333))
* optimize AlbumPhotoRow and AllPhotosRowsVirtuoso components by removing unnecessary props and improving structure ([733db18](https://github.com/travel-albums-ai/travel-albums/commit/733db181dc5c72ee4c301286a240b557608ebb26))
* simplify bundle visualization logic in vite.config.ts for improved readability ([bf2100b](https://github.com/travel-albums-ai/travel-albums/commit/bf2100bca51a4c173f9ad13d7c41fe878e032f03))
* streamline scrolling logic in AllPhotosRowsVirtuoso component ([daf5dcb](https://github.com/travel-albums-ai/travel-albums/commit/daf5dcb9880804f941f76e1c38af909ec024dded))
* update layout in AlbumPhotoRow and AllPhotosRowsVirtuoso components for improved responsiveness and clarity ([e288a9a](https://github.com/travel-albums-ai/travel-albums/commit/e288a9a605efd09e02b9e045203edc3d7256b463))

## [1.22.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.21.0...v1.22.0) (2026-08-03)

### ✨ Features

* improve photo scrolling behavior in AllPhotosRowsVirtuoso component ([48146e7](https://github.com/travel-albums-ai/travel-albums/commit/48146e797a4b49029f912a7c1fe9198a5f441e66))

### 🧹 Refactors

* simplify AlbumPhotoRow component by removing memoization and unused code ([fb5c090](https://github.com/travel-albums-ai/travel-albums/commit/fb5c090a3de7adc597a008a21c9cc464bb09f479))

## [1.21.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.20.0...v1.21.0) (2026-08-03)

### ✨ Features

* enhance AlbumPhotoRow and AlbumPhotoRowItem components with improved property display and hover effects ([8b03efa](https://github.com/travel-albums-ai/travel-albums/commit/8b03efa452a708376e072d889fd8402e880f3fb2))

## [1.20.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.19.0...v1.20.0) (2026-08-03)

### ✨ Features

* add AlbumPhotoRowItem component for improved photo property display ([924c598](https://github.com/travel-albums-ai/travel-albums/commit/924c59815f9fcbc41bc6b33b14caba58d279b7b8))

## [1.19.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.18.0...v1.19.0) (2026-08-03)

### ✨ Features

* update toolbar discovery to support group preloading and improve error handling ([f8f045a](https://github.com/travel-albums-ai/travel-albums/commit/f8f045a2d03141a86f998aaa812fcb10782820fb))

## [1.18.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.17.0...v1.18.0) (2026-08-03)

### ✨ Features

* enhance toolbar discovery with error handling and validation checks ([871d780](https://github.com/travel-albums-ai/travel-albums/commit/871d7809dd7cd257f5a6a986907d4da3b4f414cf))

### 🧹 Refactors

* optimize thumbnail dimensions and styles in AlbumPhotoRow ([6782a1f](https://github.com/travel-albums-ai/travel-albums/commit/6782a1f4385f3b7e428639c2e5487b3222f8b796))
* replace hardcoded filter with HIDDEN set in AlbumPhotoRow ([b8f9a92](https://github.com/travel-albums-ai/travel-albums/commit/b8f9a92b553530d2bbac0bb0baac762794ebbb5d))

## [1.17.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.16.0...v1.17.0) (2026-08-03)

### ✨ Features

* update FavoriteToggle to accept _photoId prop and refactor AlbumPhotoRow layout ([88c217f](https://github.com/travel-albums-ai/travel-albums/commit/88c217fc0c9441d4abfd2c3cef7581b75ff47edf))

## [1.16.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.15.0...v1.16.0) (2026-08-03)

### ✨ Features

* add GalleryPhoto import to CalendarDrawer and comment out loading state in fetchAirports ([782d8b4](https://github.com/travel-albums-ai/travel-albums/commit/782d8b4a548099dc76fb7e0e9856ceda4f0182d9))

## [1.15.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.14.0...v1.15.0) (2026-08-03)

### ✨ Features

* add loading skeleton to GeneralToolbar while waiting for readiness ([5f1f78c](https://github.com/travel-albums-ai/travel-albums/commit/5f1f78c391f319c2548fe42292ed7f2685fe3766))

## [1.14.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.13.0...v1.14.0) (2026-08-03)

### ✨ Features

* optimize toolbar registry with caching and improve toolbar item retrieval ([6201b97](https://github.com/travel-albums-ai/travel-albums/commit/6201b97d3d7b2c3af2ca279a68272934830cfb71))

## [1.13.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.12.0...v1.13.0) (2026-08-03)

### ✨ Features

* enhance toolbar component loading and caching mechanism ([fa1836c](https://github.com/travel-albums-ai/travel-albums/commit/fa1836cb7c8d6d4132abaabdccf2ff9bc734b032))

## [1.12.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.11.0...v1.12.0) (2026-08-03)

### ✨ Features

* implement toolbar discovery mechanism in GeneralToolbar and update toolbarRegistry ([bed4a63](https://github.com/travel-albums-ai/travel-albums/commit/bed4a6384f893e223f0cb08bd2b313b89592d1b5))

## [1.11.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.10.0...v1.11.0) (2026-08-03)

### ✨ Features

* refactor toggle components to implement ToolbarMeta type and remove inline metadata ([b9be750](https://github.com/travel-albums-ai/travel-albums/commit/b9be750a14366a88c0b774d6b3eb48ca385d3986))

## [1.10.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.9.0...v1.10.0) (2026-08-03)

### ✨ Features

* refactor toggle components to implement ToolbarMeta type and remove inline metadata ([0b8eaba](https://github.com/travel-albums-ai/travel-albums/commit/0b8eabaa3238e98f5b695337fe74b9a75710f49f))

## [1.9.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.8.0...v1.9.0) (2026-08-03)

### ✨ Features

* update toggle metadata files to implement ToolbarMeta type ([3a758ff](https://github.com/travel-albums-ai/travel-albums/commit/3a758ffe4f2dab0281f1e45567339615df9d0290))

## [1.8.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.7.0...v1.8.0) (2026-08-03)

### ✨ Features

* add new toggle metadata files for various features ([6cc3db1](https://github.com/travel-albums-ai/travel-albums/commit/6cc3db1e6e52dc43702aa17dd002c00ca78cab08))

## [1.7.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.6.0...v1.7.0) (2026-08-03)

### ✨ Features

* refactor toggle components by moving metadata to separate files ([9c17ddf](https://github.com/travel-albums-ai/travel-albums/commit/9c17ddf72801e656ddd8e38047b8a69e71ac956c))

## [1.6.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.5.0...v1.6.0) (2026-08-03)

### ✨ Features

* remove console log from GeneralToolbar and move SortSectionsToggle meta to a new file ([a142b03](https://github.com/travel-albums-ai/travel-albums/commit/a142b03c804b8da2559f1665fee4b8ae893ae88d))

## [1.5.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.4.0...v1.5.0) (2026-08-03)

### ✨ Features

* enhance type safety in toolbar components and improve toolbar configuration logic ([4465180](https://github.com/travel-albums-ai/travel-albums/commit/4465180d2c25abb5142ccd758cf6046f634b6ab7))

## [1.4.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.3.0...v1.4.0) (2026-08-03)

### ✨ Features

* enhance toolbar functionality with lazy loading and new metadata structure for ThumbnailCoverToggle and TutorialToggle ([7f1debf](https://github.com/travel-albums-ai/travel-albums/commit/7f1debffc3befffbba400fea6339cd615d5c5062))

## [1.3.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.2.0...v1.3.0) (2026-08-03)

### ✨ Features

* refactor layout to replace Header with GeneralToolbar and enhance toolbar functionality ([7b36b70](https://github.com/travel-albums-ai/travel-albums/commit/7b36b703928a43d950253d9b4307f7214c35b1e7))

## [1.2.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.1.0...v1.2.0) (2026-08-02)

### ✨ Features

* replace Header with GeneralToolbar and refactor SearchModal ([360b91d](https://github.com/travel-albums-ai/travel-albums/commit/360b91dd167264e244209ef44a33f61a88e37872))

## [1.1.0](https://github.com/travel-albums-ai/travel-albums/compare/v1.0.1...v1.1.0) (2026-08-02)

### ✨ Features

* implement toolbar registry and discovery for dynamic toggle components ([483001b](https://github.com/travel-albums-ai/travel-albums/commit/483001b659b475ce699856cab3b5d7d1c3105575))

## [1.0.1](https://github.com/travel-albums-ai/travel-albums/compare/v1.0.0...v1.0.1) (2026-08-01)

### 🐛 Fixes

* increase skeleton count in NoPhotos component from 8 to 12 ([20a8118](https://github.com/travel-albums-ai/travel-albums/commit/20a81181fddda6533bc8aadf12da99bd66a45e9d))

### 🔧 Chore

* **release:** reset app version to 0.0.0 ([6685235](https://github.com/travel-albums-ai/travel-albums/commit/66852358fe28b1765c1ac8f645f281fc0b6a0cca))

## 1.0.0 (2026-08-01)

### ✨ Features

* add drawer settings and toggle components; remove IndexerPage and related files ([8ef1996](https://github.com/travel-albums-ai/travel-albums/commit/8ef19963e7cfa3d857d61fc7d8b255c5d46fcfac))
* add Vercel analytics and speed insights to the application ([ac9de5c](https://github.com/travel-albums-ai/travel-albums/commit/ac9de5c2f944f4b10df8eed44154ab633da2cb89))
* enhance drawer settings with additional options and update layout configuration ([c19bd63](https://github.com/travel-albums-ai/travel-albums/commit/c19bd633374f46974af979da5b0dbefd36cebdbc))

### 🐛 Fixes

* decrease skeleton count in NoPhotos component from 12 to 8 ([fb8f8fe](https://github.com/travel-albums-ai/travel-albums/commit/fb8f8fe6a460642730612966ab0bac67dcb3fbc5))
* increase skeleton count in NoPhotos component from 8 to 12 ([a4b1da7](https://github.com/travel-albums-ai/travel-albums/commit/a4b1da758bfb44c7fef6dad166fc94891f27a67b))
* **release:** make semantic-release stable locally and in CI ([135e144](https://github.com/travel-albums-ai/travel-albums/commit/135e14400f2d77062aa1c03393bbbdafc2609c63))
* update component names in defaultJson and factory function for consistency ([4a926cd](https://github.com/travel-albums-ai/travel-albums/commit/4a926cd1a66be5f135a40316187f7ccd7990071d))
* update import path for Vercel Analytics to use the correct package ([6636896](https://github.com/travel-albums-ai/travel-albums/commit/66368968e7e58ad4a656bce39deaf70501181fc7))

### 🧹 Refactors

* clean up unused code in MainDriver component ([a2ded1a](https://github.com/travel-albums-ai/travel-albums/commit/a2ded1a9494ccfea5138d2097735e5e70daa55ae))

### 📝 Docs

* add comprehensive guide for toggle components ([9f2fb37](https://github.com/travel-albums-ai/travel-albums/commit/9f2fb3751ec360e3aa2c299516512330194f6eaf))
* add comprehensive README for indexing pipeline scripts ([d13c3e8](https://github.com/travel-albums-ai/travel-albums/commit/d13c3e8057b8e1a3e8ea0716c95292e1003c3847))
* add detailed Context Folder Guide for app state management ([be2d370](https://github.com/travel-albums-ai/travel-albums/commit/be2d370f5e89fc71f94e102a1da77f5bc26731f5))
