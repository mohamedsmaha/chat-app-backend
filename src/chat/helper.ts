export function createSecret(
  A: string,
  B: string,
  C: string,
): string {
  const a = Buffer.from(A, 'utf8');
  const b = Buffer.from(B, 'utf8');
  const c = Buffer.from(C, 'utf8');

  const maxLength = Math.max(
    a.length,
    b.length,
    c.length,
  );

  const ap = Buffer.alloc(maxLength);
  const bp = Buffer.alloc(maxLength);
  const cp = Buffer.alloc(maxLength);

  a.copy(ap);
  b.copy(bp);
  c.copy(cp);

  const result = Buffer.alloc(maxLength);

  for (let i = 0; i < maxLength; i++) {
    result[i] =
      ap[i] ^
      bp[i] ^
      cp[i];
  }

  return JSON.stringify({
    data: result.toString('base64'),
    lengthA: a.length,
    lengthB: b.length,
    lengthC: c.length,
  });
}


export function giveTheThird(
  first: string,
  second: string,
  secret: string,
): string {

  const parsed = JSON.parse(secret);

  const result = Buffer.from(
    parsed.data,
    'base64',
  );

  const a = Buffer.from(first, 'utf8');
  const b = Buffer.from(second, 'utf8');

  const fp = Buffer.alloc(result.length);
  const sp = Buffer.alloc(result.length);

  a.copy(fp);
  b.copy(sp);

  const third = Buffer.alloc(result.length);

  for (let i = 0; i < result.length; i++) {
    third[i] =
      fp[i] ^
      sp[i] ^
      result[i];
  }

  let thirdLength: number;

  if (
    a.length === parsed.lengthA &&
    b.length === parsed.lengthB
  ) {
    thirdLength = parsed.lengthC;

  } else if (
    a.length === parsed.lengthA &&
    b.length === parsed.lengthC
  ) {
    thirdLength = parsed.lengthB;

  } else if (
    a.length === parsed.lengthB &&
    b.length === parsed.lengthC
  ) {
    thirdLength = parsed.lengthA;

  } else {
    throw new Error('Invalid pair');
  }

  return third
    .subarray(0, thirdLength)
    .toString('utf8');
}