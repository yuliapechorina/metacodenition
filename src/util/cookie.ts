const setCookie = (name: string, value: any, expiryDays?: number) => {
  const expiryDate = new Date();
  if (expiryDays) {
    expiryDate.setTime(expiryDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  } else {
    expiryDate.setTime(expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }
  const expires = `expires=${expiryDate.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameLength = name.length + 1;
  return (
    document.cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .filter((cookie) => cookie.substring(0, nameLength) === `${name}=`)
      .map((cookie) => cookie.substring(nameLength))[0] || null
  );
};

export { setCookie, getCookie };
