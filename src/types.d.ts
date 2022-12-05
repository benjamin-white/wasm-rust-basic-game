declare const registerPaint: any

declare namespace CSS {
	namespace paintWorklet {
		export function addModule(url: URL): void
  }
  interface PropertyDefinition {
    name: string
    syntax?: string
    inherits: boolean
    initialValue?: string | number
  }
  function registerProperty (propertyDefinition: PropertyDefinition): undefined
}