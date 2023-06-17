export const RegexEmail = (email) => {
  const regex         = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i

  return regex.test(email)
}

export const RegexOneWord = (word) => {
  const regex         = /^(\w+)$/i

  return regex.test(word)
}