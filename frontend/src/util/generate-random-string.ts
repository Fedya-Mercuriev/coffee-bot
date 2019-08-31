function generateString(length: number): string {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function generateRandomString(
  length: number,
  mapToCompare?: Map<string, any>
): string {
  let result = '';
  if (mapToCompare) {
    result = generateString(length);
    while (mapToCompare.has(result)) {
      result = generateString(length);
    }
  } else {
    result = generateString(length);
  }
  return result;
}
