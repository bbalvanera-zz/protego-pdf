export function isProd(): boolean {
  let prod = false;

  process.argv.forEach(arg => {
    if (arg === '--prod' || arg === '-p') {
      prod = true;
    }
  });

  return prod || !!process.env.PROD;
}
