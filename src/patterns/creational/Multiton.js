const multitonPattern = {
  id: 'multiton',
  name: 'Multiton',
  category: 'creational',
  description: 'Extiende el patrón Singleton para permitir un número controlado de instancias identificadas por claves, proporcionando acceso global a cada instancia específica.',
  theory: {
    background: 'El patrón Multiton es una generalización del patrón Singleton, que permite un número limitado de instancias de una clase, cada una identificada por una clave única. Se considera una variante menos conocida del Singleton pero útil cuando se necesitan múltiples instancias controladas de un objeto. A diferencia del Pool de Objetos, el Multiton mantiene instancias identificables y persistentes.',
    problem: 'En algunas aplicaciones, necesitamos tener un conjunto limitado y controlado de instancias de una clase, cada una con un propósito específico y accesible globalmente mediante un identificador único.',
    solution: 'El patrón Multiton mantiene un registro (generalmente un mapa o diccionario) de todas las instancias creadas, indexadas por una clave única. Cuando se solicita una instancia con una clave particular, el patrón verifica si ya existe en el registro y la devuelve; si no existe, crea una nueva instancia, la registra con la clave proporcionada y la devuelve.',
    applicability: [
      'Cuando se necesita un número controlado de instancias de una clase, cada una con un propósito específico',
      'Para gestionar recursos que deben estar disponibles globalmente pero con diferentes configuraciones',
      'En la implementación de subsistemas o servicios donde cada instancia maneja un aspecto diferente',
      'Para simular un espacio de nombres o una enumeración con comportamiento',
      'Cuando se quiere limitar la creación de objetos por razones de rendimiento o recursos'
    ],
    consequences: [
      'Proporciona acceso global a instancias específicas identificadas por claves',
      'Garantiza que solo existe una instancia por cada clave',
      'Permite la inicialización perezosa de instancias (solo se crean cuando se solicitan)',
      'Puede complicar las pruebas unitarias al introducir estado global',
      'Podría llevar a un acoplamiento excesivo si se usa indiscriminadamente',
      'Riesgo de fugas de memoria si las instancias no se gestionan adecuadamente',
      'Aumenta la complejidad comparado con un Singleton simple'
    ]
  }
};

export default multitonPattern; 