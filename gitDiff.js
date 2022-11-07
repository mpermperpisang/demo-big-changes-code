const { exec } = require('child_process');

exec('git diff --stat | sed -n -e "/changed/p"', (_, gitDiff) => {
  const filesChanged = gitDiff.match(/[0-9]+(?=\sfile(s)?\schanged)/g) || 0;
  const insertions = parseInt(gitDiff.match(/[0-9]+(?=\sinsertions)/g), 10) || 0;
  const deletion = parseInt(gitDiff.match(/[0-9]+(?=\sdeletion)/g), 10) || 0;
  const linesChanged = insertions + deletion;

  if (filesChanged > 25 || linesChanged > 250) {
    process.stderr.write(`Big changes. Please reduce code changes before re-commit.
  Your files changed => ${filesChanged}.
  Your lines changed => ${linesChanged}\n\n`);

    process.exit(1);
  }
});
