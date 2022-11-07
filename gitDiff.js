const { exec } = require('child_process');

exec('git diff --stat | sed -n -e "/changed/p"', (_, gitDiff) => {
  // get number only from files changed
  const filesChanged = parseInt(gitDiff.match(/[0-9]+(?=\sfile(s)?\schanged)/g), 10) || 0;
  // get number only from insertions
  const insertions = parseInt(gitDiff.match(/[0-9]+(?=\sinsertion(s)?)/g), 10) || 0;
  // get number only from deletions
  const deletion = parseInt(gitDiff.match(/[0-9]+(?=\sdeletion(s)?)/g), 10) || 0;
  const linesChanged = insertions + deletion;
  const maxFiles = filesChanged > 25;
  const maxLines = linesChanged > 250;
  const addsFilesMsg = maxFiles ? 'Max files must be 25.' : '';
  const addsLinesMsg = maxLines ? 'Max lines must be 250.' : '';

  if (maxFiles || maxLines) {
    process.stderr.write(`Big changes. Please reduce code changes before re-commit.
  Your files changed => ${filesChanged}. ${addsFilesMsg}
  Your lines changed => ${linesChanged}. ${addsLinesMsg}\n\n`);

    process.exit(1);
  }
});
