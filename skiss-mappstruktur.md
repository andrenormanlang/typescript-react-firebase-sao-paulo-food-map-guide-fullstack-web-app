Felicias förslag på mappstruktur:

.gitignore
editorconfig
netlify.toml
.env
.env-example
src
  assets
    img
    scss
      pages
        HomePageStyles
      components
  components
    pages
      HomePageComponents
        hero
        main
        footer
      MapPageComponents
        SideBarList
        InfoBox
      FoodPlaceListPage
        ListGrid
        etc
    etc
  contexts
    AuthContextProvider.tsx
  hooks
  (helpers)
  pages
    partials
      Navigation
    HomePage
    MapPage
    FoodPlaceListPage
    NotFoundPage
  services
    firebase
    googleMapsGeoCodingAPI
  types
  App.tsx
  main.tsx


