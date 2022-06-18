### mixin code preference

h1 {
  @include breakpoint(large) {
    font-size: em(26);
  }
}

@media screen and (max-width: 455px) {
  h1 {
    font-size: em(26);
  }
}
