
export function to_lower_snake_case(text: string) {
  if (text.length == 1)
    return text

  return text[0].toLowerCase() + text.substr(1).replace(/[A-Z]+/g, i => '_' + i.toLowerCase())
}

export function to_lower(text: string) {
  return text[0].toLowerCase() + text.substr(1)
}