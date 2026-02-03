export function formatArgv(argv: string[]): string {
  return argv.map(escapeArg).join(" ");
}

function escapeArg(arg: string): string {
  if (/^[A-Za-z0-9_./-]+$/.test(arg)) {
    return arg;
  }
  const escaped = arg.replace(/"/g, "\\\"");
  return `"${escaped}"`;
}
