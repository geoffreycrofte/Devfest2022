const locales = require("./locales/config.json").map((l) => l.code);

/** Removes the useless pages (ex: /en/team.fr/)
 *   Changes path for files with extensions: /fr/team.fr/ -> /fr/team/
 *   Duplicates the french pages to create entrypoints without explicit languages: https://github.com/gatsbyjs/themes/issues/124
 */
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // /en/team.fr/ -> prefix: en; suffix: en
  const extensionMatch =
    /\/(?:(?<prefix>[a-z]{2}))?[^.]*(?:\.(?<suffix>[a-z]{2}))?\//.exec(
      page.path
    );
  console.log(page.path, extensionMatch);
  if (extensionMatch) {
    let pathWithoutSuffix = page.path;
    if (
      extensionMatch.groups.suffix &&
      extensionMatch.groups.prefix === extensionMatch.groups.suffix
    ) {
      pathWithoutSuffix = page.path.replace(
        `.${extensionMatch.groups.suffix}/`,
        "/"
      );
      createPage({
        ...page,
        path: pathWithoutSuffix,
      });
    }
    if (
      extensionMatch.groups.prefix === "fr" &&
      (!extensionMatch.groups.suffix || extensionMatch.groups.suffix === "fr")
    ) {
      createPage({
        ...page,
        path: pathWithoutSuffix.substring(3),
      });
    }
    if (extensionMatch.groups.suffix) {
      deletePage(page);
    }
  }
};