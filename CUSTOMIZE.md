# Reuse this profile

The profile copy describes engineering responsibilities rather than a particular technology stack. No framework list or public project gallery is required.

To use it for another account:

1. Copy README.md, assets/, scripts/, profile.config.json, and .github/workflows/ into a public repository named exactly after that account's username.
2. Replace “The Dev Craft” in assets/banner.svg and assets/engineering.svg with that person's preferred display name. Update the banner's README alt text to match.
3. Adjust the role and introduction to reflect that person's actual experience. Check the role in the banner, terminal graphic, and their accessible descriptions as well as README.md.
4. Keep, edit, or remove the general engineering principles according to how that person works.
5. Edit the seven pipeline stages in profile.config.json to match that person's delivery process. Run `node scripts/render-profile.mjs` to regenerate the pipeline graphic.
6. Run `node scripts/validate-profile.mjs` and `node scripts/render-profile.mjs --check` to validate the assets and confirm that the generated graphic matches the configuration.

The workflow checks the profile daily, on relevant pushes, and on pull requests. It verifies asset references and checks that the pipeline graphic matches its configuration. It reads the repository only; it does not fetch account statistics or publish automated commits. Its schedule is 04:17 UTC, approximately 09:17 in Pakistan. GitHub may delay scheduled runs.

The SVG graphics include descriptive alternative content and reduce animation when the viewer requests reduced motion. This validation checks references and basic asset structure; visually review the profile after changing its name or copy.
