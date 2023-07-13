import { EmptyParametersError } from './errorHandler.js'

export function checkParameters(url, parameters) {
  const emptyParameters = []
  for (const key in parameters) {
    if (Object.hasOwn(parameters, key) && parameters[key] === undefined) {
      emptyParameters.push(key)
    }
  }
  if (emptyParameters.length > 0) {
    throw new EmptyParametersError(
      `${url}. Не все параметры переданы: ${emptyParameters.join(', ')}`
    )
  }
}

export function getCurrentDate() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear())
  return `${year}-${month}-${day}`
}
