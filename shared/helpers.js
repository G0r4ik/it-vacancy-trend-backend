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
  return new Date(Date.now()).toISOString()
}
