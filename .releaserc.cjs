module.exports = {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits"
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "✨ Features", hidden: false },
            { type: "fix", section: "🐛 Fixes", hidden: false },
            { type: "perf", section: "⚡ Performance", hidden: false },
            { type: "refactor", section: "🧹 Refactors", hidden: false },
            { type: "docs", section: "📝 Docs", hidden: false },
            { type: "test", section: "✅ Tests", hidden: false },
            { type: "build", section: "📦 Build", hidden: false },
            { type: "ci", section: "🤖 CI", hidden: false },
            { type: "chore", section: "🔧 Chore", hidden: false },
            { type: "revert", section: "⏪ Reverts", hidden: false }
          ]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        releasedLabels: false
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
